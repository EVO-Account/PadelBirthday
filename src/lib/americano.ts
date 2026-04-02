import type { Player } from './types'
import { TOURNAMENT } from './constants'

interface MatchSetup {
  round_number: number
  court_number: number
  team1_player1: string
  team1_player2: string
  team2_player1: string
  team2_player2: string
}

/**
 * Generate a full Americano tournament schedule.
 *
 * Goals:
 * - Every player partners with every other player at least once
 * - Balanced mixed-gender matchups where possible
 * - Uses up to TOURNAMENT.courts courts per round
 */
export function generateAmericanoMatches(players: Player[]): MatchSetup[] {
  const activePlayers = players.filter((p) => p.playing_padel)
  const n = activePlayers.length

  if (n < 4) return []

  // Number of players per round (must be multiple of 4)
  const playersPerRound = Math.min(n, TOURNAMENT.courts * 4)
  const courtsPerRound = Math.floor(playersPerRound / 4)

  // Generate all unique partnerships
  const partnerships: [number, number][] = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      partnerships.push([i, j])
    }
  }

  // Track how many times each pair has partnered together
  const partnerCount = new Map<string, number>()
  const pairKey = (a: number, b: number) =>
    `${Math.min(a, b)}-${Math.max(a, b)}`

  // Track how many times each pair has faced each other
  const opponentCount = new Map<string, number>()

  const matches: MatchSetup[] = []
  const usedPartnerships = new Set<string>()

  // We need enough rounds so every player partners with every other
  // For n players, each player needs (n-1) different partners
  // Each round a player has 1 partner, so we need at least (n-1) rounds
  const totalRounds = n - 1

  // If n is not divisible by 4, some players sit out each round
  // We use a rotation to ensure fair sit-out distribution
  const sitOutCount = new Array(n).fill(0)

  for (let round = 0; round < totalRounds; round++) {
    // Select players for this round — pick those who've sat out most
    let roundPlayers: number[]
    if (n <= playersPerRound) {
      // Everyone plays if we have enough courts
      if (n % 4 === 0) {
        roundPlayers = Array.from({ length: n }, (_, i) => i)
      } else {
        // Some must sit out
        const sitOuts = n - Math.floor(n / 4) * 4
        const sorted = Array.from({ length: n }, (_, i) => i).sort(
          (a, b) => sitOutCount[a] - sitOutCount[b]
        )
        roundPlayers = sorted.slice(0, sorted.length - sitOuts)
        for (const idx of sorted.slice(sorted.length - sitOuts)) {
          sitOutCount[idx]++
        }
      }
    } else {
      const sorted = Array.from({ length: n }, (_, i) => i).sort(
        (a, b) => sitOutCount[a] - sitOutCount[b]
      )
      roundPlayers = sorted.slice(0, playersPerRound)
      for (const idx of sorted.slice(playersPerRound)) {
        sitOutCount[idx]++
      }
    }

    // Generate teams for this round using a greedy approach
    // Prioritize partnerships that haven't happened yet
    const roundMatches = generateRoundMatches(
      roundPlayers,
      activePlayers,
      round + 1,
      courtsPerRound,
      partnerCount,
      opponentCount,
      usedPartnerships,
      pairKey
    )

    // Update tracking
    for (const match of roundMatches) {
      const indices = [
        roundPlayers.indexOf(
          activePlayers.findIndex((p) => p.id === match.team1_player1)
        ),
      ]
      // Update partner counts
      const t1p1Idx = activePlayers.findIndex(
        (p) => p.id === match.team1_player1
      )
      const t1p2Idx = activePlayers.findIndex(
        (p) => p.id === match.team1_player2
      )
      const t2p1Idx = activePlayers.findIndex(
        (p) => p.id === match.team2_player1
      )
      const t2p2Idx = activePlayers.findIndex(
        (p) => p.id === match.team2_player2
      )

      const pk1 = pairKey(t1p1Idx, t1p2Idx)
      const pk2 = pairKey(t2p1Idx, t2p2Idx)
      partnerCount.set(pk1, (partnerCount.get(pk1) || 0) + 1)
      partnerCount.set(pk2, (partnerCount.get(pk2) || 0) + 1)
      usedPartnerships.add(pk1)
      usedPartnerships.add(pk2)

      // Update opponent counts
      for (const a of [t1p1Idx, t1p2Idx]) {
        for (const b of [t2p1Idx, t2p2Idx]) {
          const ok = pairKey(a, b)
          opponentCount.set(ok, (opponentCount.get(ok) || 0) + 1)
        }
      }

      void indices // suppress unused
    }

    matches.push(...roundMatches)
  }

  return matches
}

function generateRoundMatches(
  roundPlayerIndices: number[],
  allPlayers: Player[],
  roundNumber: number,
  maxCourts: number,
  partnerCount: Map<string, number>,
  _opponentCount: Map<string, number>,
  usedPartnerships: Set<string>,
  pairKey: (a: number, b: number) => string
): MatchSetup[] {
  const matches: MatchSetup[] = []
  const available = [...roundPlayerIndices]

  // Score partnerships: prefer unused ones
  function partnershipScore(a: number, b: number): number {
    const key = pairKey(a, b)
    if (!usedPartnerships.has(key)) return 0 // Best: never partnered
    return partnerCount.get(key) || 0
  }

  for (let court = 0; court < maxCourts && available.length >= 4; court++) {
    // Find best partnership for team 1
    let bestScore = Infinity
    let bestPair: [number, number] = [0, 1]

    for (let i = 0; i < available.length; i++) {
      for (let j = i + 1; j < available.length; j++) {
        const score = partnershipScore(available[i], available[j])
        if (score < bestScore) {
          bestScore = score
          bestPair = [i, j]
        }
      }
    }

    const team1 = [available[bestPair[1]], available[bestPair[0]]]
    available.splice(bestPair[1], 1)
    available.splice(bestPair[0], 1)

    // For team 2, try to match gender balance
    const team1Mixed = isTeamMixed(team1, allPlayers)

    bestScore = Infinity
    bestPair = [0, 1]
    let bestMixedMatch = false

    for (let i = 0; i < available.length; i++) {
      for (let j = i + 1; j < available.length; j++) {
        const score = partnershipScore(available[i], available[j])
        const mixed = isTeamMixed([available[i], available[j]], allPlayers)
        const mixedMatch = team1Mixed === mixed

        if (
          score < bestScore ||
          (score === bestScore && mixedMatch && !bestMixedMatch)
        ) {
          bestScore = score
          bestPair = [i, j]
          bestMixedMatch = mixedMatch
        }
      }
    }

    const team2 = [available[bestPair[1]], available[bestPair[0]]]
    available.splice(bestPair[1], 1)
    available.splice(bestPair[0], 1)

    matches.push({
      round_number: roundNumber,
      court_number: court + 1,
      team1_player1: allPlayers[team1[0]].id,
      team1_player2: allPlayers[team1[1]].id,
      team2_player1: allPlayers[team2[0]].id,
      team2_player2: allPlayers[team2[1]].id,
    })
  }

  return matches
}

function isTeamMixed(playerIndices: number[], allPlayers: Player[]): boolean {
  const genders = playerIndices
    .map((i) => allPlayers[i]?.gender)
    .filter(Boolean)
  return genders.length === 2 && genders[0] !== genders[1]
}
