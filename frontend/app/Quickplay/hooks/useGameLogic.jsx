import React from "react";
import { useState, useEffect, useRef } from 'react';
// import mockalbumdata from '../../mockalbumdata'
// import mocktracklist from '../../mocktracklist';
// import { mockTracks } from "../mocks/mockTenTracks";

export function useGameLogic() {
  const [gameState, setGameState] = useState('select'); // 'select', 'play', 'end'
  // selection states
  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);
  const [currentSongUrl, setCurrentSongUrl] = useState(null);
  const [selectedAlbumsIds, setSelectedAlbumsIds] = useState([]);

  // play states
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [trackList, setTrackList] = useState([]);
  const [rounds, setRounds] = useState(10);
  const [allTracks, setAllTracks] = useState([]);

  //end state
  const [scoreList, setScoreList] = useState([]);

  const ARTIST_ID_TEST = 4495513


  const removeDupes = (albums) => {
    const map = new Map();

    albums.forEach(album => {
      const key = album.title.toLowerCase();
      if (!map.has(key)) {
        map.set(key, album);
      }
    })
    return Array.from(map.values());
  }



  const fetchAlbums = async () => {
    try {
      console.log("Fetching albums...")
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deezer/artist/${ARTIST_ID_TEST}/albums`)
      const data = await res.json()
      console.log("data:", data)
      const albumData = data.data
      const singles = removeDupes(albumData.filter((album) => album.record_type === "single" && album.explicit_lyrics === true))
      const albums = removeDupes(albumData.filter(album => (album.record_type === "album" || album.record_type === "ep")
        && album.explicit_lyrics === true))
      console.log("singles", singles)
      setSingles(singles)
      setAlbums(albums)

    } catch (error) {
      console.error("error getting album data", error)
    }
  }

  useEffect(() => {
    fetchAlbums();
  }, [])

  const fetchTrackList = async (id) => {
    console.log("fetching with id:", id)
    try {
      const res = await fetch(`http://localhost:5000/api/deezer/${id}/tracks`)
      const trackdata = await res.json()
      console.log("fetchTrackList: ", trackdata)
      return trackdata
    } catch (err) {
      console.error("error in fetchTrackList", err)
      return []
    }

  }


  const getTracksFromSelectedAlbums = async () => {
    try {
      const trackLists = [];
      for (const id of selectedAlbumsIds) {
        const tracks = await fetchTrackList(id);
        trackLists.push(tracks);
      }
      console.log("tracklist after fetchingTrackList:", trackLists)
      const tracks = trackLists.flat()
      setAllTracks(tracks);
      const shuffled = tracks;

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const tenTrackList = shuffled.slice(0, 10);
      setTrackList(tenTrackList)
      // getRandomTrack(tracks)
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
    setCurrentSongUrl(randomTrackData.preview)
  }


  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }
  const allItems = [...albums, ...singles];
  const allSelected = selectedAlbumsIds.length === allItems.length && allItems.length > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedAlbumsIds([])
    } else {
      setSelectedAlbumsIds(allItems.map(album => album.id))
    }
  }

  const handleStartGame = () => {
    setGameState('play');
    getTracksFromSelectedAlbums();
  }

  const handleEndgame = () => {
    setGameState('end');
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
    singles,
    setSingles,
    // play states
    currentTrackIndex,
    setCurrentTrackIndex,
    score,
    setScore,
    handleStartGame,
    rounds,
    setRounds,
    allTracks,
    setAllTracks,
    scoreList,
    setScoreList

  }
}