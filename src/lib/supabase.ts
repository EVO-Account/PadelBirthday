import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url?.trim() || !key?.trim()) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. In Vercel: Project → Settings → Environment Variables, add both for Production, then Redeploy (Vite inlines these at build time).'
    )
  }
  client = createClient(url, key)
  return client
}

/** Lazy client so invite pages load even when env is only needed on RSVP/admin routes. */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const c = getClient()
    const value = Reflect.get(c, prop, receiver) as unknown
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(c) : value
  },
})
