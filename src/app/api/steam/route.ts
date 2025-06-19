import { NextResponse } from 'next/server';
import { throttle } from '../../../lib/utils';

const STEAM_URL = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/';
const KEY = process.env.NEXT_PUBLIC_STEAM_API_KEY;

async function fetchPlayerData(id: string) {
    const response = await fetch(`${STEAM_URL}?key=${KEY}&steamids=${id}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching data:', response.status, errorText);
        return null;
    }

    const data = await response.json();
    return data;
}

export async function GET(request: Request) {
    await throttle();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('Retrieved ID from query param:', id); // Debugging line

    if (!id) {
        return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    const data = await fetchPlayerData(id); // Call the fetchData function

    if (!data) {
        return NextResponse.json({ error: 'Error fetching data from Steam' }, { status: 500 });
    }

    return NextResponse.json(data);
}

