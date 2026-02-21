import { useEffect, useState } from "react";
import { Trophy, Medal } from 'lucide-react';
export default function ScoreBoard({ players, user }) {

  players.sort((a, b) => b.score - a.score);
  return (
    <div className="bg-neutral-900 p-4 rounded-lg shadow-lg">
      <div className="flex items-center pb-2 border-b-1">
        <Trophy className="mr-2" size={32} />
        <p className="text-2xl font-bold">Scoreboard</p>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {players.map((player, index) => (
          <div key={index} className={`flex justify-between items-center p-2 rounded ${player.nickname === user ? 'bg-teal-700' : 'bg-neutral-800'}`}>
            <span>{player.nickname}</span>
            <span className="font-bold">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}