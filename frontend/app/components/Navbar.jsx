import React from 'react'
import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from 'lucide-react';

function Navbar() {
  return (
    <nav className='p-4 w-screen flex flex-row items-center gap-x-15 border-b border-teal-900'>
      <Link href="/">
        <Image
          src="/songquizLogo.png"
          alt='Logo'
          width={70}
          height={70}
        />
      </Link>




    </nav >
  )
}

export default Navbar