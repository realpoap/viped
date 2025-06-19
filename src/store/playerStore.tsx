import { create } from 'zustand'

type Player = {
    steamid: string;
    personaname: string,
    personastate: string,
    loccountrycode: string,
    locstatecode: string,
    avatarfull: string,
    profileurl: string,
    timecreated: Date,
}

export type Game = {
    appid: number;
    name: string;
    playtime_forever: number;
    rtime_last_played: Date;
    img_icon_url: string;
    has_community_visible_stats: boolean;
    has_leaderboards: boolean
};

type PlayerState = {
    id: string | undefined;
    player: Player;
    games: Game[];
    loading: boolean;
    setId: (id: string) => void;
    setPlayer: (player: Player) => void;
    setGames: (games: Game[]) => void;
    setLoading: (loading: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    id: undefined,
    player: {} as Player,
    games: [],
    loading: false,
    setId: (id) => set({ id }),
    setPlayer: (player) => set({ player }),
    setGames: (games) => set({ games }),
    setLoading: (loading) => set({ loading })
}));