'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function JoinPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userNameInput, setUserNameInput] = useState("");

  useEffect(() => {
    if (!roomId) return;
    const validateRoom = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/lobby/active?roomId=${roomId}`);
        if (response.status === 403) {
          setErrorMsg("Room is full");
          toast.error("Room is full", {
            duration: 2000,
            style: {
              background: '#171717',
              color: '#fff',
            }
          });
          setTimeout(() => {
            router.push('/');
          }, 2000);

          return;
        }
        if (!response.ok) {
          router.push('/');
        } else {
          setIsValid(true);
        }

      } catch (e) {
        console.error("Error validating room:", e);
        router.push('/');
      }
    }
    validateRoom();

  }, [roomId, router]);



  const handleJoin = () => {
    sessionStorage.setItem('ticket', 'valid');
    sessionStorage.setItem('username', userNameInput);
    router.push(`/lobby/${roomId}`);
  }

  if (!isValid) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-neutral-800 text-white">
        <Toaster />
        <div className="text-center text-white">
          Loading...
        </div>
      </div >
    )
  }
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-neutral-900 text-white">
      <h1 className="text-2xl ">Room{roomId}</h1>
      <label htmlFor="nickname" className='text-lg mt-5'>
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
        onClick={handleJoin}
        className="flex-row hover:text-teal-500 transition ease-in-out duration-200 cursor-pointer
         bg-neutral-900 border-1 rounded-sm w-30 h-15 items-center justify-center flex mt-10"
      >
        Join room
      </button>
    </div>
  )
}