export interface Player {
  id: string
  name: string
  gender: 'M' | 'F' | null
  playing_padel: boolean
}

export interface Match {
  id: string
  round_number: number
  court_number: number
  team1_player1: string
  team1_player2: string
  team2_player1: string
  team2_player2: string
  team1_score: number | null
  team2_score: number | null
  status: 'pending' | 'in_progress' | 'completed'
}

export interface LeaderboardEntry {
  player: Player
  totalPoints: number
  matchesPlayed: number
  matchesWon: number
}
