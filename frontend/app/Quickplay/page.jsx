'use client'
import React from 'react'
import Navbar from "../components/Navbar";
import { useState, useEffect, useRef } from 'react';
import mockalbumdata from '../mockalbumdata'
import mocktracklist from '../mocktracklist';

function Quickplay() {
    const [albums, setAlbums] = useState([])
    const [currentSongUrl, setCurrentSongUrl] = useState(null)
    const audioRef = useRef(null)
    const ARTIST_ID_TEST = 4495513
    
    useEffect(() => {
        const albums = mockalbumdata.data.filter(
        album => album.record_type === "album" && album.explicit_lyrics === true
        );
        setAlbums(albums)
    }, [])
    const fetchAlbums = async () =>  {
      try {
        const res = await fetch(`http://localhost:5000/api/artist/${ARTIST_ID_TEST}/albums`)
        const data = await res.json()
        console.log(`albums `, data.data)
        const albumData = data.data
        const albums = albumData.filter(album => album.record_type === "album" && album.explicit_lyrics === true)
        setAlbums(albums)

      } catch (error) {
        console.error("error getting album data", error)
      }
    }
    
    const getRandomTrack = () => {
        const randomTrackData = mocktracklist.data[Math.floor(Math.random() * mocktracklist.data.length)]
        console.log(randomTrackData.title)
        console.log(randomTrackData.preview)
        setCurrentSongUrl(randomTrackData.preview)

        
    }
    useEffect(() => {
        if (audioRef.current && currentSongUrl) {
      audioRef.current.load();       // Reset audio element
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay failed:", err);
      });
    }
    }, [currentSongUrl])
    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause()
        }
    }

    const List = ({items}) => {
        return (
            <div className='flex justify-center items-center w-full'>
                <div className='flex flex-row flex-wrap'>
                {items.map((item) => (
                    <div key={item.id}
                        onClick={() => getRandomTrack()}
                        className="w-32 flex flex-col items-center text-center"
                    >
                        <img src={item.cover_medium} alt={item.title} className='w-28 h-28'/>
                        <p className='text-wrap w-28'>{item.title}</p>
                    </div>
                ))}
                </div>
            </div>
        )
    }
    


  return (
    <div>
        <h1>Select albums from list to play</h1>
        <List items={albums} />
        {currentSongUrl && (
            <>
            <audio
                ref={audioRef}
                autoPlay 
                //onLoadedData={handleAudioLoad}
                controls
                //crossOrigin="anonymous"
            > 
                <source src={currentSongUrl} type="audio/mpeg"/>
            </audio>
            <button onClick={pauseAudio}>Stop</button>
            </>
            
            )}
    </div>
  )
}

export default Quickplay