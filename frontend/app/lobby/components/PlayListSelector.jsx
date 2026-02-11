import { useState, useEffect } from "react";

const artists = [
  { id: "230", name: "Kanye West", genre: "RAP" },
  { id: "4495513", name: "Travis Scott", genre: "RAP" },
  { id: "14456487", name: "Juice Wrld", genre: "RAP" },

]
const GENRES = ["ALL", "ROCK", "POP", "RAP"];
export default function PlayListSelector({ selectedPlayList, onSelect }) {
  const [activeGenre, setActiveGenre] = useState("ALL");
  const filteredPlayList = activeGenre === "ALL"
    ? artists
    : artists.filter(artist => artist.genre === activeGenre);

  const handleGenreSelect = (genre) => {
    if (activeGenre === genre) {
      setActiveGenre("ALL");
    } else {
      setActiveGenre(genre);
    }
  }
  return (
    <>
      <div>
        <h2 className="text-lg font-bold m-4">Select a playlist</h2>

        <div>
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenreSelect(genre)}
              className={`${activeGenre === genre ? "bg-teal-600 text-white" : "bg-neutral-800 text-white"}
              px-4 py-2 m-2 rounded-md cursor-pointer hover:text-teal-500 `}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="flex flex-row">
          {filteredPlayList.map(artist => (
            <div
              key={artist.id}
              className={`p-4 m-2 bg-neutral-800 rounded-md w-20 h-20 cursor-pointer hover:text-teal-500
                ${selectedPlayList === artist.id ? "border-2 border-teal-500" : ""}`}
              onClick={() => onSelect(artist.id, artist.name)}
            >

              <span className="text-lg font-semibold">{artist.name}</span>
            </div>

          ))}
        </div>

      </div>

    </>
  )
}