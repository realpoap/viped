import { NextResponse } from 'next/server';

const STEAM_URL =
    'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/';
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
        return NextResponse.json({ error: txt }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data);
}

export async function GET(req: Request) {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    return fetchOwnedGames(id);
}
