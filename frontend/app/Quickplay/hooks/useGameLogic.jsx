import React from "react";
import { useState, useEffect, useRef } from 'react';
import mockalbumdata from '../../mockalbumdata'
import mocktracklist from '../../mocktracklist';

export function useGameLogic() {
  const [gameState, setGameState] = useState('select'); // 'selection', 'play', 'end'
  // selection states
  const [albums, setAlbums] = useState([])
  const [currentSongUrl, setCurrentSongUrl] = useState(null)
  const [selectedAlbumsIds, setSelectedAlbumsIds] = useState([])

  // play states
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [trackList, setTrackList] = useState([]);



  const ARTIST_ID_TEST = 4495513

  useEffect(() => {
    const albums = mockalbumdata.data.filter(
      album => album.record_type === "album" && album.explicit_lyrics === true
    );
    setAlbums(albums)
  }, [])

  const fetchAlbums = async () => {
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
      const res = await fetch(`http://localhost:5000/api/${id}/tracks`)
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
      console.log("tracks:", tracks)
      setTrackList(tracks)
      getRandomTrack(tracks)
    } catch (err) {
      console.error("Error getting tracks from albums", err);
    }

  }

  const getRandomTrack = (tracklist) => {
    if (tracklist.length === 0) {
      console.warn("Tracklist is empty, cannot select random track.");
      return;
    }
    const randomTrackData = tracklist[Math.floor(Math.random() * tracklist.length)]
    console.log(randomTrackData.type)
    console.log(randomTrackData.preview)
    setCurrentSongUrl(randomTrackData.preview)
    console.log("current song:", randomTrackData.title)
  }

  //when song url changes resets the audio player
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

  return {
    gameState,
    setGameState,
    // selection states
    albums,
    setAlbums,
    currentSongUrl,
    setCurrentSongUrl,
    selectedAlbumsIds,
    setSelectedAlbumsIds,
    trackList,
    setTrackList,
    toggleAll,
    getTracksFromSelectedAlbums,
    pauseAudio,
    // play states
    audioRef,
    currentTrackIndex,
    setCurrentTrackIndex,
    score,
    setScore,


  }
}