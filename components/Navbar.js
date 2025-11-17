"use client"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const Navbar = () => {

  const pathName = usePathname();

  if (pathName == "/Dashboard") {
    return null; // Hide navbar on all other routes
  }

  return (
    <nav className="flex justify-between bg-[#0066ff] text-white items-center p-6 px-10">
      <Link href="/"><h1 className="font-bold text-lg">Salest</h1></Link>
      <div className="links flex gap-3">
        <Link href="/">Home</Link>
        <Link href="/signup">Login</Link>
      </div>
    </nav>
  )
}

export default Navbar
