import React from "react";
import List from '../../components/TrackListCards';
import Navbar from "../../components/Navbar";
export default function SelectState({ albums, selectedAlbumsIds, toggleAll, setSelectedAlbumsIds,
  currentSongUrl, audioRef, getTracksFromSelectedAlbums, pauseAudio, handleStartGame, singles }) {

  console.log("albums", albums);
  console.log("singles", singles);

  return (
    <div className=''>
      <Navbar />
      {/* select state */}
      {albums?.length > 0 ? (
        <>
          <h1>Select albums from list to play</h1>
          <div className='flex justify-center items-center'>
            <List
              items={albums}
              singles={singles}
              selectedIds={selectedAlbumsIds}
              setSelectedAlbumIds={setSelectedAlbumsIds}
              onSelect={(id) => {
                const newSelected = selectedAlbumsIds.includes(id)
                  //removes id from list
                  ? selectedAlbumsIds.filter((selectedId) => selectedId !== id)
                  : [...selectedAlbumsIds, id];

                setSelectedAlbumsIds(newSelected);

              }}
              toggleAll={toggleAll}

            />
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center h-64">
            <p>Loading albums...</p>
          </div>

        </>
      )}


      <div className='flex justify-center mt-20 gap-5'>
        <button
          className='cursor-pointer border rounded-sm bg-neutral-800 p-3 hover:text-teal-500 transition ease-in-out duration 150'
          onClick={handleStartGame}
        >
          Start Game
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