'use client';
import Image from "next/image";
import Navbar from "./components/Navbar";
import { Play } from 'lucide-react';
import { useState } from "react";
import getSong from "./api/preview";
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();
export default function Home() {
  const [isScaled, setIsScaled] = useState(false);
  const [trackIds, setTrackIds] = useState([])
  const [token, setToken] = useState("")
  const [url, setUrl] = useState("")
   
  const ARTIST_ID_TEST = 4495513
    
  
    const fetchAlbums = async () =>  {
      try {
        const res = await fetch(`https://api.deezer.com/artist/${artistId}/albums`)
        const data = await res.json()
        console.log(`albums ${data.data}`)

        const albums = data.filter(album => album.record_type === "album")
        console.log("filtered albums", albums.title)

      } catch (error) {
        console.error("error getting album data", error)
      }
       


    }
  
    

  
  
  

 
  const handleMouseDown = () => {
    setIsScaled(true); // Scale up when the mouse is pressed down
  };

  const handleMouseUp = () => {
    setIsScaled(false); // Reset scale when mouse is released
  };


  const getPreview = async() => {
    
  }


  return (
    <main className="">
      <section className="flex flex-col p-4 items-center justify-center">
        <h1 className="text-2xl">Welcome to Song quiz!</h1>
        <p className="opacity-60 text-center max-w-lg">Press play to create a lobby where you can challenge your friends or yourself trying to guess the song name or artist!</p>
          <button 
           onMouseDown={handleMouseDown}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}
          className={`flex-row hover:text-teal-500 transition ease-in-out duration-200 cursor-pointer bg-neutral-900 border-1 rounded-sm w-60 h-70 items-center justify-center flex mt-10  ${isScaled ? 'scale-105' : 'scale-100'} `}>
            Play <Play className=""/>
          </button>
       
      </section>
      <div className="flex flex-row gap-20 ">
        
          <button 
          onClick={handleClick}
          className="cursor-pointer hover:text-teal-500"
          >cliock me!</button>

        <button 
          onClick={getPreview}
          className="cursor-pointer hover:text-teal-500"
          >GET TRACK DATA</button>
        
      </div>
    </main>
  );
}
