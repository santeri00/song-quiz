import React from "react";
import List from '../../components/TrackListCards';

export default function SelectState({ albums, selectedAlbumsIds, toggleAll, setSelectedAlbumsIds, currentSongUrl, audioRef, getTracksFromSelectedAlbums, pauseAudio }) {

  return (
    <div className=''>
      {/* select state */}
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
          toggleAll={toggleAll}

        />

        {currentSongUrl && (
          <>
            <audio
              ref={audioRef}
              autoPlay
              controls
            >
              <source src={currentSongUrl} type="audio/mpeg" />
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