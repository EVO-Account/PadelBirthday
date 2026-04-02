import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function DeclineSuccess() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center text-center gap-8 py-12">
      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-danger to-accent flex items-center justify-center text-6xl shadow-2xl shadow-danger/30">
        😢
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-text">We'll Miss You!</h1>
        <p className="text-text-muted text-lg">
          It won't be the same without you. If your plans change, you're always welcome!
        </p>
      </div>

      <Button variant="outline" onClick={() => navigate('/')}>
        I've Changed My Mind
      </Button>
    </div>
  )
}
