import React from 'react'
import Link from "next/link";
import Image from "next/image";
import { useRouter} from 'next/navigation'
export default function PlayNavbar({ currentTrackIndex, rounds }) {
  const router = useRouter();
  return (
    <nav className='relative p-4 w-screen flex flex-row items-center gap-x-15 border-b border-teal-900'>
      <div>
        <Link href="/">
          <Image
            src="/songquizLogo.png"
            alt='Logo'
            width={70}
            height={70}
          />
        </Link>
      </div>


      <div className='absolute left-1/2 top-0 -translate-x-1/2 h-[120%] w-3/8
       bg-neutral-900 flex justify-center items-center z-10 [clip-path:polygon(0_0,100%_0,88%_100%,12%_100%)]
       '>
        <div className="font-bold text-2xl">
          Round {currentTrackIndex} / {rounds}
        </div>
      </div>

      <div className="ml-auto pr-4 z-20">
        <button onClick={()=>{
          router.push("/");
        }}>quit</button>
      </div>

    </nav>
  )
}