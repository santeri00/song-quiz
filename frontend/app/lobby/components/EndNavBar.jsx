import React from 'react'
import Link from "next/link";
import Image from "next/image";

function EndNavbar() {
  return (
    <nav className='p-4 w-full flex flex-row items-center justify-between border-b border-teal-900'>
      <div className=''>
        <Link href="/">
          <Image
            src="/songquizLogo.png"
            alt='Logo'
            width={70}
            height={70}
          />
        </Link>
      </div>

      <div className='absolute left-1/2 -translate-x-1/2 font-bold text-3xl'>
        <h1>Game Finished!</h1>
      </div>


    </nav>
  )
}

export default EndNavbar