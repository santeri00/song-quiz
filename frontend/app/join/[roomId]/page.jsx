'use client'
import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function JoinPage() {
  const { roomId } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!roomId) return;

    sessionStorage.setItem('ticket', 'valid');



  }, [roomId, router]);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-neutral-900 text-white">
      <h1 className="text-2xl ">Room{roomId}</h1>
      <button
        onClick={() => router.push(`/lobby/${roomId}`)}
        className="flex-row hover:text-teal-500 transition ease-in-out duration-200 cursor-pointer
         bg-neutral-900 border-1 rounded-sm w-30 h-15 items-center justify-center flex mt-10"
      >
        Join room
      </button>
    </div>
  )
}