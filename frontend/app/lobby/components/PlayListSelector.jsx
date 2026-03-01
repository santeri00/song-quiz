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
      <div className="p-6 text-xl">
        <h2 className="text-3xl font-bold m-4 text-left">Select a playlist</h2>

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

        <div className="flex flex-row gap-5">
          {filteredPlayList.map(artist => (
            <div
              key={artist.id}
              className={`m-2 rounded-md flex flex-col cursor-pointer items-center hover:text-teal-500 text-center
                ${selectedPlayList === artist.id ? "text-teal-500" : ""}`}
              onClick={() => onSelect(artist.id, artist.name)}
            >
              <img className={`rounded-full w-28 h-28 ${selectedPlayList === artist.id ? "border-2 border-teal-500" : ""}`} src="https://cdn-images.dzcdn.net/images/artist/bb76c2ee3b068726ab4c37b0aabdb57a/56x56-000000-80-0-0.jpg" alt="" />
              <span className="text-xl">{artist.name}</span>
            </div>

          ))}
        </div>

      </div>

    </>
  )
}