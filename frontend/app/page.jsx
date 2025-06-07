'use client';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Navbar from "./components/Navbar";
import { Play } from 'lucide-react';
import { useState } from "react";
import getSong from "./api/preview";

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();
export default function Home() {
  const router = useRouter();

  const [isScaled, setIsScaled] = useState(false);
  const [isScaled2, setIsScaled2] = useState(false)
  const [trackIds, setTrackIds] = useState([])
  const [token, setToken] = useState("")
  const [url, setUrl] = useState("")
   
  
  
 
  const handleMouseDown = (button_num) => {
    if (button_num === 2) {
      setIsScaled2(true)
    } else {
      setIsScaled(true); // Scale up when the mouse is pressed down
    }
    
  };

  const handleMouseUp = (button_num) => {
     if (button_num === 2) {
      setIsScaled2(false)
    } else {
      setIsScaled(false); // Scale up when the mouse is pressed down
    }
  };

  const handleClick = async() => {
    
  }
  const getPreview = async() => {
    
  }


  return (
    <main className="">
      <section className="flex flex-col p-4 items-center justify-center">
        <h1 className="text-2xl">Welcome to Song quiz!</h1>
        <p className="opacity-60 text-center max-w-lg">Press play to create a lobby where you can challenge your friends or yourself trying to guess the song name or artist!</p>
          <div className="flex flex-row gap-5">
              <button 
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex-row hover:text-teal-500 transition ease-in-out duration-200 cursor-pointer bg-neutral-900 border-1 rounded-sm w-60 h-70 items-center justify-center flex mt-10  ${isScaled ? 'scale-105' : 'scale-100'} `}>
              Play <Play className=""/>
            </button>

            <button 
            onMouseDown={() => handleMouseDown(2)}
            onMouseUp={() => handleMouseUp(2)}
            onMouseLeave={() => handleMouseUp(2)}
            onClick={() => router.push('/Quickplay')}
            className={`flex-row hover:text-teal-500 transition ease-in-out duration-200 cursor-pointer bg-neutral-900 border-1 rounded-sm w-60 h-70 items-center justify-center flex mt-10  ${isScaled2 ? 'scale-105' : 'scale-100'} `}>
              Quickplay <Play className=""/>
            </button>
          </div>
          
       
      </section>
    </main>
  );
}
