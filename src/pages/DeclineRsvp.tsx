import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'

export default function DeclineRsvp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim()) {
      setError('Please enter your name')
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
      setError('Something went wrong. Please try again.')
      return
    }

    navigate('/success/decline')
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text">That's too bad!</h1>
        <p className="text-text-muted mt-2">Let us know who you are before you go.</p>
      </div>

      <div className="flex flex-col gap-5 bg-surface-light rounded-2xl p-5">
        <Input
          label="Your Name"
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          label="Reason (optional)"
          id="reason"
          placeholder="Let us know why you can't make it..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-danger text-sm text-center">{error}</p>
      )}

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </div>
  )
}
