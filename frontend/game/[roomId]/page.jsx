"use client"
import { useParams } from 'next/navigation';
import PlayNavbar from '../../app/Quickplay/components/PlayNavbar';
import { useEffect, useState } from 'react';

function Game() {

  const { roomId } = useParams();

  return (
    <div>
      <PlayNavbar />
      <h1>Game Room: {roomId}</h1>
    </div>
  )
}