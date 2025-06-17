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

type Game = {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    has_community_visible_stats: boolean;
    // Add other properties as needed
};

type PlayerState = {
    id: string | undefined;
    player: Player;
    games: Game[];
    setId: (id: string) => void;
    setPlayer: (player: Player) => void;
    setGames: (games: Game[]) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    id: undefined,
    player: {} as Player,
    games: [],
    setId: (id) => set({ id }),
    setPlayer: (player) => set({ player }),
    setGames: (games) => set({ games }),
}));