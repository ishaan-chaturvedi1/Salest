"use client"
import DashboardHome  from "@/components/dashboardHome.js"
import Analytics from "@/components/analytics.js";
import { useState } from "react";

const page = () => {
    const [page, setPage] = useState("home");

    return (
        <div className="flex">
            <nav className="bg-white h-full z-22 fixed left-0 flex flex-col width-[13vw] p-3 border-1">
                <input type="radio" checked={page==="home"} value="home" onChange={() => {setPage("home")}} name="navOption" id="home" className="peer sr-only cursor-pointer" />
                <label htmlFor="home"><img src="/home.svg" alt="home" className="cursor-pointer" /></label>
                <input type="radio" checked={page==="analytics"} value="analytics" onChange={() => {setPage("analytics")}} name="navOption" id="analytics" className="peer sr-only cursor-pointer" />
                <label htmlFor="analytics"><img src="/analytics.svg" alt="analytics" className="cursor-pointer" /></label>
            </nav>
            {page === "home" && <DashboardHome />}
            {page === "analytics" && <Analytics />}
        </div>
    )
}

export default page