import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useI18n } from '../i18n'
import type { Player, Match, LeaderboardEntry } from '../lib/types'

export default function Tournament() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'leaderboard' | 'matches'>('leaderboard')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [playersRes, matchesRes] = await Promise.all([
      supabase.from('rsvps').select('id, name, gender, playing_padel').eq('attending', true).eq('playing_padel', true),
      supabase.from('matches').select('*').order('round_number').order('court_number'),
    ])
    setPlayers((playersRes.data as Player[]) || [])
    setMatches((matchesRes.data as Match[]) || [])
    setLoading(false)
  }

  function getPlayerName(id: string) {
    return players.find((p) => p.id === id)?.name || t.tournament.unknown
  }

  function getLeaderboard(): LeaderboardEntry[] {
    const stats = new Map<string, { totalPoints: number; matchesPlayed: number; matchesWon: number }>()
    for (const p of players) stats.set(p.id, { totalPoints: 0, matchesPlayed: 0, matchesWon: 0 })

    for (const match of matches) {
      if (match.status !== 'completed' || match.team1_score == null || match.team2_score == null) continue
      const t1Won = match.team1_score > match.team2_score
      for (const pid of [match.team1_player1, match.team1_player2]) {
        const s = stats.get(pid)
        if (s) { s.totalPoints += match.team1_score; s.matchesPlayed++; if (t1Won) s.matchesWon++ }
      }
      for (const pid of [match.team2_player1, match.team2_player2]) {
        const s = stats.get(pid)
        if (s) { s.totalPoints += match.team2_score; s.matchesPlayed++; if (!t1Won) s.matchesWon++ }
      }
    }

    return players
      .map((player) => ({ player, ...(stats.get(player.id) || { totalPoints: 0, matchesPlayed: 0, matchesWon: 0 }) }))
      .sort((a, b) => b.totalPoints - a.totalPoints || b.matchesWon - a.matchesWon)
  }

  const rounds = [...new Set(matches.map((m) => m.round_number))].sort((a, b) => a - b)

  if (loading) {
    return (
      <div className="flex flex-col min-h-svh bg-surface-primary">
        <div className="flex items-center justify-center p-4 border-b border-[rgba(247,247,244,0.2)]">
          <p className="text-[14px] text-text-primary text-center w-[190px] leading-[1.5]">{t.tournament.title}</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-muted">{t.tournament.loading}</p>
        </div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col min-h-svh bg-surface-primary relative pb-24">
        <div className="flex items-center justify-center p-4 border-b border-[rgba(247,247,244,0.2)]">
          <p className="text-[14px] text-text-primary text-center w-[190px] leading-[1.5]">{t.tournament.title}</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 w-[358px]">
            <div className="w-[184px] h-[151px]">
              <img src="/images/padel-ball.svg" alt="" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-display text-text-primary text-[32px] leading-none tracking-[-0.48px] text-center w-[308px]">
              {t.tournament.emptyHeading}
            </h1>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-surface-primary border-t border-[#393939] p-4 flex z-10">
          <div className="flex-1 max-w-md mx-auto">
            <button onClick={() => navigate('/details')} className="w-full h-12 rounded-full font-bold text-[18px] text-text-primary relative overflow-hidden cursor-pointer border border-border-secondary">
              <div className="absolute inset-0 bg-surface-contrast rounded-full" />
              <div className="absolute inset-0 rounded-full shadow-[inset_0px_-3px_2px_0px_rgba(26,26,26,0.4),inset_0px_-3px_3px_0px_#262626,inset_0px_1px_2px_0px_rgba(26,26,26,0.2)]" />
              <span className="relative z-10">{t.tournament.editResponse}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const leaderboard = getLeaderboard()

  return (
    <div className="flex flex-col gap-5 py-6 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text">{t.tournament.heading}</h1>
        <p className="text-text-muted text-sm mt-1">
          {t.tournament.stats.replace('{players}', String(players.length)).replace('{rounds}', String(rounds.length))}
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('leaderboard')} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${tab === 'leaderboard' ? 'bg-primary text-white' : 'bg-surface-light text-text-muted'}`}>
          {t.tournament.leaderboard}
        </button>
        <button onClick={() => setTab('matches')} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${tab === 'matches' ? 'bg-primary text-white' : 'bg-surface-light text-text-muted'}`}>
          {t.tournament.matches}
        </button>
      </div>

      {tab === 'leaderboard' && (
        <div className="bg-surface-light rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-2 text-xs text-text-muted font-semibold border-b border-surface-lighter">
            <span>{t.tournament.rank}</span>
            <span>{t.tournament.player}</span>
            <span className="text-center">{t.tournament.pts}</span>
            <span className="text-center">{t.tournament.wins}</span>
            <span className="text-center">{t.tournament.mp}</span>
          </div>
          {leaderboard.map((entry, i) => (
            <div key={entry.player.id} className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-2.5 items-center border-b border-surface-lighter/50 last:border-0 ${i < 3 ? 'bg-primary/5' : ''}`}>
              <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-accent' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-text-muted'}`}>{i + 1}</span>
              <span className="text-sm text-text font-medium truncate">
                {entry.player.name}
                {entry.player.gender && <span className="text-xs text-text-muted ml-1">({entry.player.gender})</span>}
              </span>
              <span className="text-sm font-bold text-text text-center w-8">{entry.totalPoints}</span>
              <span className="text-sm text-success text-center w-8">{entry.matchesWon}</span>
              <span className="text-sm text-text-muted text-center w-8">{entry.matchesPlayed}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'matches' && (
        <div className="flex flex-col gap-4">
          {rounds.map((round) => (
            <div key={round} className="bg-surface-light rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-primary mb-3">{t.tournament.round.replace('{n}', String(round))}</h2>
              <div className="flex flex-col gap-3">
                {matches.filter((m) => m.round_number === round).map((match) => (
                  <div key={match.id} className="bg-surface rounded-xl p-3">
                    <span className="text-xs text-text-muted mb-2 block">{t.tournament.court.replace('{n}', String(match.court_number))}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 text-right">
                        <p className="text-xs text-text font-medium">{getPlayerName(match.team1_player1)}</p>
                        <p className="text-xs text-text font-medium">{getPlayerName(match.team1_player2)}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2">
                        {match.status === 'completed' ? (
                          <>
                            <span className={`text-lg font-bold ${(match.team1_score || 0) > (match.team2_score || 0) ? 'text-success' : 'text-text-muted'}`}>{match.team1_score}</span>
                            <span className="text-text-muted text-sm">-</span>
                            <span className={`text-lg font-bold ${(match.team2_score || 0) > (match.team1_score || 0) ? 'text-success' : 'text-text-muted'}`}>{match.team2_score}</span>
                          </>
                        ) : (
                          <span className="text-text-muted text-sm">{t.tournament.vs}</span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs text-text font-medium">{getPlayerName(match.team2_player1)}</p>
                        <p className="text-xs text-text font-medium">{getPlayerName(match.team2_player2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
