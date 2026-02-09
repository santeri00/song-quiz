'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function JoinPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const validateRoom = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/lobby/active?roomId=${roomId}`);

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
    router.push(`/lobby/${roomId}`);
  }

  if (!isValid) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-neutral-900 text-white">
        <div className="text-center bg-neutral-900 text-white">
          Loading...
        </div>
      </div >
    )
  }
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-neutral-900 text-white">
      <h1 className="text-2xl ">Room{roomId}</h1>
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