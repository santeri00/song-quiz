import { useEffect, useState } from "react";
import { Trophy, Medal } from 'lucide-react';
export default function InfoScreen({ rounds, playlist }) {


  return (
    <div className="p-5 flex-col gap-5 flex">
      <p>Rounds: {rounds}</p>
      <p className="flex flex-row gap-2">Playlist:
        {playlist ? (
          <span>{playlist}</span>
        ) : (
          <span>no playlist selected</span>
        )}

      </p>
    </div >
  )
}