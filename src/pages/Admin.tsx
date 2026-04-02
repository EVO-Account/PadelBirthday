import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { generateAmericanoMatches } from '../lib/americano'
import { TOURNAMENT } from '../lib/constants'
import { useI18n } from '../i18n'
import type { Player, Match } from '../lib/types'
import { Button } from '@/components/ui/button'

export default function Admin() {
  const { t } = useI18n()
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [tab, setTab] = useState<'players' | 'matches'>('players')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [playersRes, matchesRes] = await Promise.all([
      supabase
        .from('rsvps')
        .select('id, name, gender, playing_padel, attending')
        .eq('attending', true)
        .order('created_at'),
      supabase.from('matches').select('*').order('round_number').order('court_number'),
    ])
    setPlayers((playersRes.data as Player[]) || [])
    setMatches((matchesRes.data as Match[]) || [])
    setLoading(false)
  }

  async function updateGender(playerId: string, gender: 'M' | 'F') {
    await supabase.from('rsvps').update({ gender }).eq('id', playerId)
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, gender } : p))
    )
  }

  async function handleGenerateMatches() {
    const padelPlayers = players.filter((p) => p.playing_padel)
    const ungenderedPlayers = padelPlayers.filter((p) => !p.gender)

    if (ungenderedPlayers.length > 0) {
      alert(t.admin.assignGender.replace('{names}', ungenderedPlayers.map((p) => p.name).join(', ')))
      return
    }

    if (padelPlayers.length < 4) {
      alert(t.admin.needMore)
      return
    }

    setGenerating(true)

    // Delete existing matches
    await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Generate new matches
    const matchSetups = generateAmericanoMatches(padelPlayers)

    // Insert in batches
    const { error } = await supabase.from('matches').insert(
      matchSetups.map((m) => ({
        ...m,
        status: 'pending',
      }))
    )

    if (error) {
      alert(t.admin.errorGenerating.replace('{error}', error.message))
    } else {
      await loadData()
      setTab('matches')
    }

    setGenerating(false)
  }

  async function updateScore(
    matchId: string,
    team1Score: number,
    team2Score: number
  ) {
    if (team1Score + team2Score !== TOURNAMENT.pointsPerMatch) {
      alert(t.admin.scoresMustAdd.replace('{total}', String(TOURNAMENT.pointsPerMatch)))
      return
    }

    await supabase
      .from('matches')
      .update({
        team1_score: team1Score,
        team2_score: team2Score,
        status: 'completed',
      })
      .eq('id', matchId)

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, team1_score: team1Score, team2_score: team2Score, status: 'completed' }
          : m
      )
    )
  }

  const padelPlayers = players.filter((p) => p.playing_padel)
  const nonPadelPlayers = players.filter((p) => !p.playing_padel)
  const rounds = [...new Set(matches.map((m) => m.round_number))].sort(
    (a, b) => a - b
  )

  function getPlayerName(id: string) {
    return players.find((p) => p.id === id)?.name || 'Unknown'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted">{t.admin.loading}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text">{t.admin.title}</h1>
        <p className="text-text-muted text-sm mt-1">
          {t.admin.stats.replace('{confirmed}', String(players.length)).replace('{playing}', String(padelPlayers.length))}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('players')}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            tab === 'players'
              ? 'bg-primary text-white'
              : 'bg-surface-light text-text-muted'
          }`}
        >
          {t.admin.playersTab.replace('{n}', String(players.length))}
        </button>
        <button
          onClick={() => setTab('matches')}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            tab === 'matches'
              ? 'bg-primary text-white'
              : 'bg-surface-light text-text-muted'
          }`}
        >
          {t.admin.matchesTab.replace('{n}', String(matches.length))}
        </button>
      </div>

      {tab === 'players' && (
        <div className="flex flex-col gap-4">
          {/* Padel players */}
          <div className="bg-surface-light rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-primary mb-3">
              {t.admin.playingPadel.replace('{n}', String(padelPlayers.length))}
            </h2>
            <div className="flex flex-col gap-2">
              {padelPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between py-2 border-b border-surface-lighter/50 last:border-0"
                >
                  <span className="text-text font-medium text-sm">
                    {player.name}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => updateGender(player.id, 'M')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        player.gender === 'M'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'bg-surface border-surface-lighter text-text-muted'
                      }`}
                    >
                      M
                    </button>
                    <button
                      onClick={() => updateGender(player.id, 'F')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        player.gender === 'F'
                          ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                          : 'bg-surface border-surface-lighter text-text-muted'
                      }`}
                    >
                      F
                    </button>
                  </div>
                </div>
              ))}
              {padelPlayers.length === 0 && (
                <p className="text-text-muted text-sm text-center py-2">
                  {t.admin.noPadelPlayers}
                </p>
              )}
            </div>
          </div>

          {/* Non-padel guests */}
          {nonPadelPlayers.length > 0 && (
            <div className="bg-surface-light rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-accent mb-3">
                {t.admin.attending.replace('{n}', String(nonPadelPlayers.length))}
              </h2>
              <div className="flex flex-col gap-1">
                {nonPadelPlayers.map((player) => (
                  <div key={player.id} className="py-1.5">
                    <span className="text-text-muted text-sm">
                      {player.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate matches button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleGenerateMatches}
            disabled={generating || padelPlayers.length < 4}
          >
            {generating
              ? t.admin.generating
              : matches.length > 0
                ? t.admin.regenerateMatches
                : t.admin.generateMatches}
          </Button>
          {padelPlayers.length > 0 && padelPlayers.length < 4 && (
            <p className="text-danger text-xs text-center">
              {t.admin.needMinPlayers}
            </p>
          )}
        </div>
      )}

      {tab === 'matches' && (
        <div className="flex flex-col gap-4">
          {rounds.length === 0 ? (
            <div className="bg-surface-light rounded-2xl p-8 text-center">
              <p className="text-text-muted">
                {t.admin.noMatches}
              </p>
            </div>
          ) : (
            rounds.map((round) => (
              <div key={round} className="bg-surface-light rounded-2xl p-4">
                <h2 className="text-sm font-semibold text-primary mb-3">
                  {t.admin.round.replace('{n}', String(round))}
                </h2>
                <div className="flex flex-col gap-3">
                  {matches
                    .filter((m) => m.round_number === round)
                    .map((match) => (
                      <MatchScoreCard
                        key={match.id}
                        match={match}
                        getPlayerName={getPlayerName}
                        onSaveScore={updateScore}
                      />
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function MatchScoreCard({
  match,
  getPlayerName,
  onSaveScore,
}: {
  match: Match
  getPlayerName: (id: string) => string
  onSaveScore: (matchId: string, t1: number, t2: number) => void
}) {
  const { t: i18n } = useI18n()
  const [t1, setT1] = useState(match.team1_score?.toString() || '')
  const [t2, setT2] = useState(match.team2_score?.toString() || '')
  const [editing, setEditing] = useState(false)

  const isCompleted = match.status === 'completed'

  function handleSave() {
    const s1 = parseInt(t1)
    const s2 = parseInt(t2)
    if (isNaN(s1) || isNaN(s2)) return
    onSaveScore(match.id, s1, s2)
    setEditing(false)
  }

  return (
    <div className="bg-surface rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted">{i18n.admin.court.replace('{n}', String(match.court_number))}</span>
        {isCompleted && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-primary cursor-pointer"
          >
            {i18n.admin.edit}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Team 1 */}
        <div className="flex-1 text-right">
          <p className="text-xs text-text font-medium">
            {getPlayerName(match.team1_player1)}
          </p>
          <p className="text-xs text-text font-medium">
            {getPlayerName(match.team1_player2)}
          </p>
        </div>

        {/* Score */}
        {isCompleted && !editing ? (
          <div className="flex items-center gap-1 px-2">
            <span
              className={`text-lg font-bold ${
                (match.team1_score || 0) > (match.team2_score || 0)
                  ? 'text-success'
                  : 'text-text-muted'
              }`}
            >
              {match.team1_score}
            </span>
            <span className="text-text-muted text-sm">-</span>
            <span
              className={`text-lg font-bold ${
                (match.team2_score || 0) > (match.team1_score || 0)
                  ? 'text-success'
                  : 'text-text-muted'
              }`}
            >
              {match.team2_score}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-1">
            <input
              type="number"
              min="0"
              max={TOURNAMENT.pointsPerMatch}
              value={t1}
              onChange={(e) => {
                setT1(e.target.value)
                const v = parseInt(e.target.value)
                if (!isNaN(v)) setT2(String(TOURNAMENT.pointsPerMatch - v))
              }}
              className="w-10 bg-surface-light border border-surface-lighter rounded-lg text-center
                text-text py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-text-muted text-sm">-</span>
            <input
              type="number"
              min="0"
              max={TOURNAMENT.pointsPerMatch}
              value={t2}
              onChange={(e) => {
                setT2(e.target.value)
                const v = parseInt(e.target.value)
                if (!isNaN(v)) setT1(String(TOURNAMENT.pointsPerMatch - v))
              }}
              className="w-10 bg-surface-light border border-surface-lighter rounded-lg text-center
                text-text py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSave}
              className="ml-1 px-2 py-1 bg-primary rounded-lg text-white text-xs font-semibold cursor-pointer"
            >
              ✓
            </button>
          </div>
        )}

        {/* Team 2 */}
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
  )
}
