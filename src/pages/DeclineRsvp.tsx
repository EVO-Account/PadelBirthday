import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useI18n } from '../i18n'

export default function DeclineRsvp() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim()) {
      setError(t.decline.errorName)
      return
    }

    setLoading(true)
    setError('')

    const { error: dbError } = await supabase.from('rsvps').insert({
      name: name.trim(),
      attending: false,
      decline_reason: reason.trim() || null,
    })

    setLoading(false)

    if (dbError) {
      setError(t.decline.errorGeneric)
      return
    }

    navigate('/success/decline', { state: { name: name.trim() } })
  }

  return (
    <div className="flex flex-col min-h-svh bg-surface-primary relative pb-24">
      <div className="flex items-center justify-between p-4 border-b border-[rgba(247,247,244,0.2)]">
        <button onClick={() => navigate('/details')} className="size-10 rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer border border-border-secondary" style={{ boxShadow: '0px 2px 4px 0px rgba(29,29,29,0.2)' }}>
          <div className="absolute inset-0 bg-surface-contrast rounded-full" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0px_-3px_2px_0px_rgba(26,26,26,0.4),inset_0px_-3px_3px_0px_#262626,inset_0px_1px_2px_0px_rgba(26,26,26,0.2)]" />
          <img src="/images/icons/arrow-left.svg" alt={t.decline.back} className="relative z-10 size-[18px]" />
        </button>
        <p className="text-[14px] text-text-primary text-center w-[190px]">{t.decline.title}</p>
        <div className="size-10 opacity-0" />
      </div>

      <div className="flex flex-col items-center gap-6 px-4 pt-8">
        <div className="w-[184px] h-[151px]">
          <img src="/images/tombstone-imok.svg" alt="" className="w-full h-full object-contain" />
        </div>

        <h1 className="font-display text-text-primary text-[32px] leading-none tracking-[-0.48px] text-center w-[247px]">
          {t.decline.heading}
        </h1>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-3 w-full">
            <p className="text-[16px] text-text-primary leading-[1.5]">{t.decline.nameLabel}</p>
            <div className="backdrop-blur-[12px] bg-[rgba(17,17,15,0.2)] border border-border-secondary rounded-lg h-12 px-4 flex items-center">
              <input type="text" placeholder={t.decline.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent w-full text-[12px] text-text-primary placeholder:text-white/70 leading-[1.5] outline-none" />
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <p className="text-[16px] text-text-primary leading-[1.5]">{t.decline.messageLabel}</p>
            <div className="backdrop-blur-[12px] bg-[rgba(17,17,15,0.2)] border border-border-secondary rounded-lg h-[161px] p-4">
              <textarea placeholder={t.decline.messagePlaceholder} value={reason} onChange={(e) => setReason(e.target.value)} className="bg-transparent w-full h-full text-[12px] text-text-primary placeholder:text-white/70 leading-[1.5] outline-none resize-none" />
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface-primary border-t border-[#393939] p-4 flex gap-2 z-10">
        <div className="flex-1 max-w-md mx-auto flex gap-2">
          <button onClick={() => navigate('/details')} className="flex-1 h-12 rounded-full font-bold text-[18px] text-text-primary relative overflow-hidden cursor-pointer border border-border-secondary">
            <div className="absolute inset-0 bg-surface-contrast rounded-full" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0px_-3px_2px_0px_rgba(26,26,26,0.4),inset_0px_-3px_3px_0px_#262626,inset_0px_1px_2px_0px_rgba(26,26,26,0.2)]" />
            <span className="relative z-10">{t.decline.back}</span>
          </button>
          <button onClick={handleSave} disabled={loading} className="flex-1 h-12 rounded-full font-bold text-[18px] text-text-invert relative overflow-hidden cursor-pointer border border-pink/50 disabled:opacity-50" style={{ boxShadow: '0px 2px 4px 0px #342d33, 0px 2px 10px 0px #482946' }}>
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(ellipse at 30% 100%, #ff99f7, #d470cc)' }} />
            <div className="absolute inset-0 rounded-full shadow-[inset_0px_-3px_2px_0px_#f084e8,inset_0px_0px_2px_0px_#f084e8,inset_0px_1px_2px_0px_#ff99f7]" />
            <span className="relative z-10">{loading ? t.decline.saving : t.decline.save}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
