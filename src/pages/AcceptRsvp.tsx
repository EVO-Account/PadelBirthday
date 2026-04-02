import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Toggle from '../components/ui/Toggle'

export default function AcceptRsvp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [playingPadel, setPlayingPadel] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    setLoading(true)
    setError('')

    const { error: dbError } = await supabase.from('rsvps').insert({
      name: name.trim(),
      attending: true,
      playing_padel: playingPadel,
    })

    setLoading(false)

    if (dbError) {
      setError('Something went wrong. Please try again.')
      return
    }

    navigate('/success/accept')
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text">Great, you're in!</h1>
        <p className="text-text-muted mt-2">Just a couple of details...</p>
      </div>

      <div className="flex flex-col gap-5 bg-surface-light rounded-2xl p-5">
        <Input
          label="Your Name"
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Toggle
          label="Will you play Padel?"
          value={playingPadel}
          onChange={setPlayingPadel}
        />
      </div>

      {error && (
        <p className="text-danger text-sm text-center">{error}</p>
      )}

      <div className="flex flex-col gap-3">
        <Button onClick={handleConfirm} disabled={loading}>
          {loading ? 'Confirming...' : 'Confirm'}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
