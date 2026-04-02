import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Player, Match, LeaderboardEntry } from '../lib/types'

export default function Tournament() {
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
      supabase
        .from('rsvps')
        .select('id, name, gender, playing_padel')
        .eq('attending', true)
        .eq('playing_padel', true),
      supabase
        .from('matches')
        .select('*')
        .order('round_number')
        .order('court_number'),
    ])
    setPlayers((playersRes.data as Player[]) || [])
    setMatches((matchesRes.data as Match[]) || [])
    setLoading(false)
  }

  function getPlayerName(id: string) {
    return players.find((p) => p.id === id)?.name || 'Unknown'
  }

  function getLeaderboard(): LeaderboardEntry[] {
    const stats = new Map<
      string,
      { totalPoints: number; matchesPlayed: number; matchesWon: number }
    >()

    for (const p of players) {
      stats.set(p.id, { totalPoints: 0, matchesPlayed: 0, matchesWon: 0 })
    }

    for (const match of matches) {
      if (match.status !== 'completed' || match.team1_score == null || match.team2_score == null)
        continue

      const t1Players = [match.team1_player1, match.team1_player2]
      const t2Players = [match.team2_player1, match.team2_player2]
      const t1Won = match.team1_score > match.team2_score

      for (const pid of t1Players) {
        const s = stats.get(pid)
        if (s) {
          s.totalPoints += match.team1_score
          s.matchesPlayed++
          if (t1Won) s.matchesWon++
        }
      }

      for (const pid of t2Players) {
        const s = stats.get(pid)
        if (s) {
          s.totalPoints += match.team2_score
          s.matchesPlayed++
          if (!t1Won) s.matchesWon++
        }
      }
    }

    return players
      .map((player) => ({
        player,
        ...(stats.get(player.id) || {
          totalPoints: 0,
          matchesPlayed: 0,
          matchesWon: 0,
        }),
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints || b.matchesWon - a.matchesWon)
  }

  const rounds = [...new Set(matches.map((m) => m.round_number))].sort(
    (a, b) => a - b
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted">Loading...</p>
      </div>
    )
  }

  // Empty state — no matches yet
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center text-center gap-8 py-16">
        <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/30 to-surface-light flex items-center justify-center text-5xl">
          🎾
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-text">Non-Stop Americano</h1>
          <p className="text-text-muted">
            The matches will be available on the event date. Stay tuned!
          </p>
        </div>
      </div>
    )
  }

  const leaderboard = getLeaderboard()

  return (
    <div className="flex flex-col gap-5 py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text">🎾 Non-Stop Americano</h1>
        <p className="text-text-muted text-sm mt-1">
          {players.length} players · {rounds.length} rounds
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('leaderboard')}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            tab === 'leaderboard'
              ? 'bg-primary text-white'
              : 'bg-surface-light text-text-muted'
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setTab('matches')}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            tab === 'matches'
              ? 'bg-primary text-white'
              : 'bg-surface-light text-text-muted'
          }`}
        >
          Matches
        </button>
      </div>

      {tab === 'leaderboard' && (
        <div className="bg-surface-light rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-2 text-xs text-text-muted font-semibold border-b border-surface-lighter">
            <span>#</span>
            <span>Player</span>
            <span className="text-center">Pts</span>
            <span className="text-center">W</span>
            <span className="text-center">MP</span>
          </div>
          {leaderboard.map((entry, i) => (
            <div
              key={entry.player.id}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-2.5 items-center border-b border-surface-lighter/50 last:border-0 ${
                i < 3 ? 'bg-primary/5' : ''
              }`}
            >
              <span
                className={`text-sm font-bold w-5 ${
                  i === 0
                    ? 'text-accent'
                    : i === 1
                      ? 'text-gray-400'
                      : i === 2
                        ? 'text-amber-700'
                        : 'text-text-muted'
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm text-text font-medium truncate">
                {entry.player.name}
                {entry.player.gender && (
                  <span className="text-xs text-text-muted ml-1">
                    ({entry.player.gender})
                  </span>
                )}
              </span>
              <span className="text-sm font-bold text-text text-center w-8">
                {entry.totalPoints}
              </span>
              <span className="text-sm text-success text-center w-8">
                {entry.matchesWon}
              </span>
              <span className="text-sm text-text-muted text-center w-8">
                {entry.matchesPlayed}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'matches' && (
        <div className="flex flex-col gap-4">
          {rounds.map((round) => (
            <div key={round} className="bg-surface-light rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-primary mb-3">
                Round {round}
              </h2>
              <div className="flex flex-col gap-3">
                {matches
                  .filter((m) => m.round_number === round)
                  .map((match) => (
                    <div
                      key={match.id}
                      className="bg-surface rounded-xl p-3"
                    >
                      <span className="text-xs text-text-muted mb-2 block">
                        Court {match.court_number}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 text-right">
                          <p className="text-xs text-text font-medium">
                            {getPlayerName(match.team1_player1)}
                          </p>
                          <p className="text-xs text-text font-medium">
                            {getPlayerName(match.team1_player2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 px-2">
                          {match.status === 'completed' ? (
                            <>
                              <span
                                className={`text-lg font-bold ${
                                  (match.team1_score || 0) >
                                  (match.team2_score || 0)
                                    ? 'text-success'
                                    : 'text-text-muted'
                                }`}
                              >
                                {match.team1_score}
                              </span>
                              <span className="text-text-muted text-sm">
                                -
                              </span>
                              <span
                                className={`text-lg font-bold ${
                                  (match.team2_score || 0) >
                                  (match.team1_score || 0)
                                    ? 'text-success'
                                    : 'text-text-muted'
                                }`}
                              >
                                {match.team2_score}
                              </span>
                            </>
                          ) : (
                            <span className="text-text-muted text-sm">
                              vs
                            </span>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-xs text-text font-medium">
                            {getPlayerName(match.team2_player1)}
                          </p>
                          <p className="text-xs text-text font-medium">
                            {getPlayerName(match.team2_player2)}
                          </p>
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
