import React from 'react'
import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from 'lucide-react'; 

function Navbar() {
  return (
    <nav className='p-2 w-screen flex flex-row items-center gap-x-15 border-b border-teal-900'>
        <Link href="/">
            <Image
                src="/songquizLogo.png"
                alt='Logo'
                width={70}
                height={70}
            />
        </Link>

        <Link href="/lobby" className='flex  items-center text-lg hover:text-teal-500 transition ease-in-out duration-200'>
        <span className='flex-row flex items-center gap-x-1'>
        Create a lobby
        <PlusCircle size={20}/>

        </span>
          
        </Link>
    </nav>
  )
}

export default Navbar