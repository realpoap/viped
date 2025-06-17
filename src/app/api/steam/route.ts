import { NextResponse } from 'next/server';

const url = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/';
const key = process.env.NEXT_PUBLIC_STEAM_API_KEY;

let lastRequestTime = 0;
const requestDelay = 1000; // 1 second delay between requests

async function fetchPlayerData(id: string) {
    // throttle 1 sec
    const currentTime = Date.now();
    if (currentTime - lastRequestTime < requestDelay) {
        await new Promise(resolve => setTimeout(resolve, requestDelay - (currentTime - lastRequestTime)));
    }

    const response = await fetch(`${url}?key=${key}&steamids=${id}`);
    lastRequestTime = Date.now(); // Update the last request time

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching data:', response.status, errorText);
        return null;
    }

    const data = await response.json();
    return data;
}

export async function GET(request: Request) {
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

