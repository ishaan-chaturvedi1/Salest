"use client"
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

const page = () => {

    const [Sales, setSales] = useState([]);
    const [name, setName] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [address, setAddress] = useState("");
    const [popup, setPopup] = useState(false);
    const { data: session } = useSession();
    const router = useRouter()


    async function loadSales() {
        const res = await fetch("/api/getSales", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const json = await res.json();
        setSales(json.data);
    }

    useEffect(() => {
        loadSales();
    }, [session]);



    useEffect(() => {
        if (!session) {
            router.push("/signup")
        }
    }, [session, router])

    async function Sale_create() {
        if (!/^\d{10}$/.test(phonenumber)) {
            toast.error("Enter a valid phone number!")
            return
        }
        const fetch_body = { name: name, phoneNumber: phonenumber, email: emailAddress, saleOf: session.user.email.split("@")[0], id: uuidv4(), address }
        const res = await fetch(`/api/Sale`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fetch_body) })
        const data = await res.json();
        toast.success(data.message)
        setPhonenumber("")
        setName("")
        setEmailAddress("")
        setAddress("")
        setPopup(false)
        loadSales()
    }

    async function deleteSale(id) {
        if (confirm("Are you sure you want to delete this sale?")) {
            let res = await fetch("/api/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(id) })
            let data = await res.json()
            toast.success(data.message)
            loadSales()
        }
    }

    function edit(item) {
        deleteSale(item.id)
        setName(item.name)
        setAddress(item.address)
        setPhonenumber(item.phoneNumber)
        setEmailAddress(item.email)
        setPopup(true)
        loadSales()
    }

    return (
        <div className="h-[100vh] w-full relative bg-[#f3f3f6]">
            <ToastContainer className="z-51" />
            <div className={`inset-0 popup h-full w-full bg-black/50 justify-center items-center fixed ${popup ? "flex" : "hidden"} z-50`}>
                <div className="popupbox flex gap-4 flex-col items-center rounded-xl bg-[#f3f3f6] p-10 w-[85vw] md:w-[70vw] h-[85vh] ">
                    <img onClick={() => { setPopup(false) }} className="align-right cursor-pointer fixed right-[18vw] p-3 top-[12vh]" src="/close.svg" alt="close" />
                    <h2 className="font-bold text-xl text-center">Add a new client</h2>
                    <div className="form flex flex-wrap items-center justify-center max-w-[80vw] md:max-w-[65vw] gap-4">
                        <input value={name} onChange={(e) => { setName(e.target.value) }} className="bg-white rounded-lg p-2 text-lg" type="text" placeholder="client's full name" />
                        <input value={phonenumber} onChange={(e) => { setPhonenumber(e.target.value) }} className="bg-white rounded-lg p-2 text-lg" type="text" placeholder="client's phone number" />
                        <input value={emailAddress} onChange={(e) => { setEmailAddress(e.target.value) }} className="bg-white rounded-lg p-2 text-lg" type="text" placeholder="client's email address" />
                        <input value={address} onChange={(e) => { setAddress(e.target.value) }} className="bg-white rounded-lg p-2 text-lg" type="text" placeholder="client's address" />
                        <button className="text-white flex items-center gap-1 cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => { Sale_create() }}>Add</button>
                    </div>
                </div>
            </div>
            <div className="top flex justify-center items-center p-4 w-full gap-3">
                <input className="p-2 text-lg border border-2 border-black rounded-lg" type="text" placeholder="Search clients" />
                <button onClick={() => { setPopup(true) }} className="text-white flex items-center gap-1 cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><img src="/add.svg" alt="add" />Add sale</button>
            </div>
            <hr />
            <section className="bg-[#f3f3f6]">
                <h2 className="font-bold text-center text-xl">Sales</h2>
                <div className="sales">
                    {Sales.map(item => {
                        return <div className="bg-white m-5 flex flex-wrap justify-between items-center rounded-xl p-6" key={item.id}><div><h3 className="font-bold text-xl">{item.name}</h3><div className="information flex flex-wrap gap-2 text-lg text-gray"><p>{item.phoneNumber}</p><p>• {item.email}</p><p>• {item.address}</p></div></div><div className="actions flex flex-wrap items-center justify-center gap-2"><lord-icon onClick={() => { edit(item) }} className="md:w-7 w-5 cursor-pointer"
                            src="https://cdn.lordicon.com/ntjwyxgv.json"
                            trigger="hover">
                        </lord-icon><lord-icon onClick={() => { deleteSale(item.id) }} className="md:w-7 w-5 cursor-pointer"
                            src="https://cdn.lordicon.com/xyfswyxf.json"
                            trigger="hover">
                            </lord-icon></div></div>
                    })}
                </div>
            </section>
        </div>
    )
}

export default page
