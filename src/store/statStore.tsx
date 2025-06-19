import { create } from 'zustand'

type StatState = {
    gameTotal: number,
    chartValues: Stat[],
    highestStreak: number,
    totalStreaks: number,
    coopNumber: number,
    favoredGenres: string[]
    setGameTotal: (total: number) => void
}

type Stat = {
    letter: string, // V
    label: string,  // Vitesse
    score: number, // 65
    rank: string // A
}


// VIPED - SIPED

export const useStatStore = create<StatState>((set) => ({
    gameTotal: 0,
    chartValues: [],
    highestStreak: 0,
    totalStreaks: 0,
    coopNumber: 0,
    favoredGenres: [],
    setGameTotal: (total: number) => set({ gameTotal: total }),

}))