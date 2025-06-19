import { throttle } from '@/lib/utils';
import { Game } from '@/store/playerStore';
import { NextResponse } from 'next/server';

const STEAM_URL = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/';
const ACHIEVEMENTS_URL = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/';
const GAME_DETAILS_URL = 'http://store.steampowered.com/api/appdetails';


const KEY = process.env.NEXT_PUBLIC_STEAM_API_KEY;

let lastRequest = 0;
const DELAY = 1_000; // 1 s

async function fetchOwnedGames(steamId: string) {
    const now = Date.now();
    if (now - lastRequest < DELAY) {
        await new Promise(r => setTimeout(r, DELAY - (now - lastRequest)));
    }

    const qs =
        `key=${KEY}` +
        `&steamid=${steamId}` +
        '&include_appinfo=true' +
        '&include_played_free_games=true' +
        '&format=json';

    const resp = await fetch(`${STEAM_URL}?${qs}`);
    lastRequest = Date.now();

    if (!resp.ok) {
        const txt = await resp.text();
        console.error('Steam error:', resp.status, txt);
        return { error: txt, status: resp.status };
    }

    const data = await resp.json();
    return { data };
}

async function fetchGameDetails(appid: number) {
    const details_qs = `appids=${appid}`;
    const resp = await fetch(`${GAME_DETAILS_URL}?${details_qs}`);
    if (!resp.ok) {
        const txt = await resp.text();
        console.error('Steam error:', resp.status, txt);
        return { error: txt, status: resp.status };
    }
    const data = await resp.json();
    return { data };
}

async function fetchAchievements(steamId: string, appid: number) {
    const qs = `appid=${appid}&key=${KEY}&steamid=${steamId}`;
    const resp = await fetch(`${ACHIEVEMENTS_URL}?${qs}`);

    if (!resp.ok) {
        const txt = await resp.text();
        console.error('Steam error:', resp.status, txt);
        return { error: txt, status: resp.status };
    }

    const data = await resp.json();
    return { data };
}

interface GameFullDetail {
    game: any; // Replace 'any' with the actual type if known
    achievement: any; // Replace 'any' with the actual type if known
}

export async function GET(req: Request) {
    await throttle()
    const id = new URL(req.url).searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    const ownedGamesResponse = await fetchOwnedGames(id);
    if (ownedGamesResponse.error) {
        return NextResponse.json({ error: ownedGamesResponse.error }, { status: ownedGamesResponse.status });
    }
    console.dir(ownedGamesResponse.data)

    const games = ownedGamesResponse.data?.response?.games;

    if (!games) {
        return NextResponse.json({
            ownedGames: ownedGamesResponse.data.response || { game_count: 0, games: [] },
            gameFull: []
        });
    }

    const gameFullDetails: GameFullDetail[] = [];
    for (const g of games) {
        try {
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay between each game
            const appid = Number(g.appid);

            const gameDetailsResponse = await fetchGameDetails(appid);
            if (gameDetailsResponse.error) {
                console.error(`Error fetching game details for ${appid}:`, gameDetailsResponse.error);
                continue; // Skip this game
            }

            const achievementsResponse = await fetchAchievements(id, appid);
            if (achievementsResponse.error) {
                console.error(`Error fetching achievements for ${appid}:`, achievementsResponse.error);
                // We can still include game details even if achievements fail
            }

            gameFullDetails.push({
                game: gameDetailsResponse.data,
                achievement: achievementsResponse.data
            });
        } catch (error) {
            console.error(`Error processing game ${g.appid}:`, error);
        }
    }

    return NextResponse.json({
        gameFull: gameFullDetails
    });
}


