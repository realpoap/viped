'use client'

import { useEffect, useRef, useState } from "react";
import { usePlayerStore, type Game } from "@/store/playerStore";
import { VipedCard } from "../components/card";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useStatStore } from "@/store/statStore";

export default function Home() {
  const { id, setPlayer, setId, setGames, setLoading } = usePlayerStore();
  const { setGameTotal } = useStatStore();
  const [inputValue, setInputValue] = useState(''); // Local state to hold the input value

  useEffect(() => {
    // This effect runs whenever 'id' changes.
    if (!id) return; // Don't fetch if there's no ID.

    const getData = async () => {
      // Pass the ID as a query parameter to the API route
      const response = await fetch(`/api/steam?id=${id}`);
      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        console.error('Error fetching data:', data.error);
        return;
      }

      console.dir(data); // Log the data here

      // Create a temporary object for the player data
      const playerData = {
        steamid: data.response.players[0]?.steamid,
        personaname: data.response.players[0]?.personaname,
        personastate: data.response.players[0]?.personastate,
        loccountrycode: data.response.players[0]?.loccountrycode,
        locstatecode: data.response.players[0]?.locstatecode,
        avatarfull: data.response.players[0]?.avatarfull,
        profileurl: data.response.players[0]?.profileurl,
        timecreated: new Date(data.response.players[0]?.timecreated * 1000), // Convert to Date
      };

      setPlayer(playerData); // Set the entire player object in one action

      // Fetch owned games
      const gamesResponse = await fetch(`/api/steam/games?id=${id}`);
      const gamesData = await gamesResponse.json();
      console.dir(gamesData); // Log the games data

      if (gamesResponse.ok && gamesData.response) {
        setGameTotal(gamesData.response.game_count);
        let curatedGameList: Game[] = [];
        gamesData.response.games.map((g: Game) => {
          if (g.playtime_forever > 2) {
            const obj: Game = {
              appid: g.appid,
              has_community_visible_stats: g.has_community_visible_stats,
              has_leaderboards: g.has_leaderboards,
              img_icon_url: g.img_icon_url,
              name: g.name,
              playtime_forever: g.playtime_forever,
              rtime_last_played: g.rtime_last_played
            };
            curatedGameList.push(obj);
          }
        });
        setGames(curatedGameList); // Set the games with >2h playtime in the store
      } else {
        console.error('Error fetching games:', gamesData.error || 'No response data');
      }
    };

    getData();

  }, [id, setPlayer]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    if (inputValue.trim() === '') {
      console.error('Input value is empty. Please enter a valid Steam ID.');
      return; // Prevent submission if the input is empty
    }
    setId(inputValue); // Set the player ID in the Zustand store, which triggers the useEffect
    setInputValue(''); // Optionally clear the input after submission
  };

  return (
    <div className=" flex flex-col items-center mt-4 w-full h-full">
      <form className="flex w-full max-w-sm items-center gap-2" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Steam ID"
          name="input-playerID"
          value={inputValue} // Bind the input value
          onChange={(e) => setInputValue(e.target.value)} // Update local state on input change
        />
        <Button type="submit">
          Find player
        </Button>
      </form>
      <VipedCard />
    </div >
  );
}