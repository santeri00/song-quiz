'use client'
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import SelectState from './components/SelectState';
import PlayState from './components/PlayState';
import FinishState from './components/FinishState';
import { useGameLogic } from './hooks/useGameLogic';

function Quickplay() {
  const {
    gameState,
    albums,
    currentSongUrl,
    selectedAlbumsIds,
    toggleAll,
    setSelectedAlbumsIds,
    audioRef,
    getTracksFromSelectedAlbums,
    pauseAudio,
    handleStartGame,
    trackList,
    setTrackList,
    rounds,
    setRounds,
    currentTrackIndex,
    setCurrentTrackIndex,
    score,
    setScore,
    allTracks,
    setGameState,
    singles,

  } = useGameLogic();



  const renderState = () => {
    switch (gameState) {
      case 'select':
        return <SelectState albums={albums}
          selectedAlbumsIds={selectedAlbumsIds}
          toggleAll={toggleAll}
          setSelectedAlbumsIds={setSelectedAlbumsIds}
          currentSongUrl={currentSongUrl}
          audioRef={audioRef}
          getTracksFromSelectedAlbums={getTracksFromSelectedAlbums}
          pauseAudio={pauseAudio}
          handleStartGame={handleStartGame}
          singles={singles}
        />;
      case 'play':
        return <PlayState
          trackList={trackList}
          rounds={rounds}
          setRounds={setRounds}
          currentTrackIndex={currentTrackIndex}
          setCurrentTrackIndex={setCurrentTrackIndex}
          score={score}
          setScore={setScore}
          allTracks={allTracks}
          setGameState={setGameState}
        />;
      case 'finish':
        return <FinishState />;
      default:
        return null;
    }
  }
  return (
    <div>
      {renderState()}
    </div>
  )
}

export default Quickplay