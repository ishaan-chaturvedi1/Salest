"use client"
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import { useSession } from "next-auth/react";

export default function Home() {

      const { data: session } = useSession();
      const router = useRouter()
  
      useEffect(() => {
          if (session) {
              router.push("/Dashboard")
          }
      }, [session, router])

  return (
    <div>
      <section className="flex flex-wrap">
        <img className="w-[100vw] md:w-[45vw]" src="/home.jpg" alt="management" />
        <div className="flex flex-col items-center justify-center p-5 gap-4 w-[100vw] md:w-[55vw]">
          <h2 className="font-bold text-3xl">The sales manager you need.</h2>
          <p>Salest is a sales manager which is super simple to use and is featureful. Salest provides features like exporting of data to excel and data visualization.</p>
          <div className="buttons flex">
            <Link href="/signup"><button className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Start Here</button></Link>
            <Link target="_blank" href="https://github.com/ishaan-chaturvedi1/Salest"><button className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Github</button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
