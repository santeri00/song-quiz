'use client'
import React from 'react'
import Navbar from "../components/Navbar";
import { useState, useEffect, useRef } from 'react';
import mockalbumdata from '../mockalbumdata'
import mocktracklist from '../mocktracklist';

function Quickplay() {
    const [albums, setAlbums] = useState([])
    const [currentSongUrl, setCurrentSongUrl] = useState(null)
    const [selectedAlbumsIds, setSelectedAlbumsIds] = useState([])

    const [trackList, setTrackList] = useState([])

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

    const fetchTrackList = async (id) => {
        try {
          const res  = await fetch(`http://localhost:5000/api/${id}/tracks`)
          const trackdata = await res.json()
          console.log("trackdata: ", trackdata.data)
          return trackdata.data
        } catch (err) { 
          console.error("error in fetchTrackList", err)
          return []
        }
        
    }
   

    const getTracksFromSelectedAlbums = async () => {
      try {
        const trackLists = await Promise.all(
          selectedAlbumsIds.map(id => fetchTrackList(id))
        );
        const tracks = trackLists.flat()
        console.log(tracks)
        setTrackList(tracks)
        getRandomTrack(trackList)
      } catch (err) {
        console.error("Error getting tracks from albums", err);
      }
     
    }
    
    const getRandomTrack = (tracklist) => {
        const randomTrackData = tracklist[Math.floor(Math.random() * tracklist.length)]
        console.log(randomTrackData.title)
        console.log(randomTrackData.preview)
        setCurrentSongUrl(randomTrackData.preview)
    }
   
    //when song url changes resetes the audio player
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

    const allSelected = albums.length === selectedAlbumsIds.length && albums.every(album => selectedAlbumsIds.includes(album.id))

    const toggleAll = () => {
      if (allSelected) {
        setSelectedAlbumsIds([])
      } else {
        setSelectedAlbumsIds(albums.map(album => album.id))
      }
    }
    console.log(allSelected)


    const List = ({ items, selectedIds, onSelect }) => {
          return (
            
            <div className='flex justify-center items-center w-full p-3'>
              <button className='cursor-pointer border rounded-sm bg-neutral-800 p-3 hover:text-teal-500 transition ease-in-out duration 150'
                onClick={toggleAll}
              >
              select all
            </button>
                <div className='flex flex-row flex-wrap gap-5'>
                {items.map((item) => (
                    <label key={item.id}
                        className="relative flex flex-col items-center text-center box-border border p-5
                          bg-neutral-900 hover:text-teal-500  has-checked:text-teal-500
                          cursor-pointer rounded-sm transition ease-in duration-200 select-none"
                    > 
                      <div>
                        <img src={item.cover_medium} alt={item.title} className='h-36 w-36'/>
                      </div>
                        
                        <p className='text-wrap w-28 pb-4'>{item.title}</p>
                        <input 
                          type='checkbox'
                          className='absolute bottom-3 right-5 cursor-pointer appearance-none rounded-full w-6 h-6 border checked:bg-green-500'
                           id={`checkbox-${item.id}`} 
                           
                          checked={selectedIds.includes(item.id)}
                          onChange={() => onSelect(item.id)}
                        />
                    </label>
                ))}
                </div>
                <div className="mt-5 text-white">
                  Selected IDs: {JSON.stringify(selectedIds)}
                </div>
            </div>
        )
    }
    


  return (
    <div className=''>
        <h1>Select albums from list to play</h1>
        <div className=''>
          <List 
          items={albums} 
          selectedIds={selectedAlbumsIds}
          onSelect={(id) => { 
          const newSelected = selectedAlbumsIds.includes(id)
          //removes id from list
          ? selectedAlbumsIds.filter((selectedId) => selectedId !== id)
          : [...selectedAlbumsIds, id];

          setSelectedAlbumsIds(newSelected);
          }}
          
        />

          {currentSongUrl && (
              <>
              <audio
                  ref={audioRef}
                  autoPlay 
                  controls
              > 
                  <source src={currentSongUrl} type="audio/mpeg"/>
              </audio>
              <button onClick={pauseAudio}>Stop</button>
              </>
              
              )}
        </div>
        <div className='flex justify-center mt-20'>
         <button
          className='cursor-pointer border rounded-sm bg-neutral-800 p-3 hover:text-teal-500 transition ease-in-out duration 150'
         >
              Confirm selection
         </button>

          <button
          className='cursor-pointer border rounded-sm bg-neutral-800 p-3 hover:text-teal-500 transition ease-in-out duration 150'
          onClick={getTracksFromSelectedAlbums}
         >
              get tracklist
         </button>
            
         
        </div>
    </div>
  )
}
 
export default Quickplay