'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
export default function LobbyCreateScreen({ startGame }) {
  const [userNameInput, setUserNameInput] = useState("");

  const handleCreateRoom = () => {
    let username = userNameInput.trim();

    if (!username) {
      username = "Player" + Math.floor(Math.random() * 1000);
    }

    sessionStorage.setItem("username", username);
    startGame();
  }


  return (
    <div className="flex flex-col h-screen items-center justify-center pb-32 bg-#2e3a2b text-white">
      <div className='flex flex-col items-center bg-neutral-800 p-10 pt-20 rounded-lg '>
        <h1 className='text-xl'>username</h1>
        <label htmlFor="nickname" className='text-lg'>
          <input
            type="text"
            id='nickname'
            maxLength={10}
            placeholder='name'
            value={userNameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
            className='p-3 bg-neutral-700 rounded-md focus:border focus:border-teal-500 focus:outline-none '
          />
        </label>
        <button
          onClick={handleCreateRoom}
          className="flex-row hover:text-teal-500 transition ease-in-out duration-200 cursor-pointer
         bg-neutral-900 border-1 rounded-sm w-40 h-15 items-center justify-center flex mt-10"
        >
          Create room
        </button>
      </div>

    </div>
  )
}