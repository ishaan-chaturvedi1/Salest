"use client"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

const Page = () => {

    const [sales, setSales] = useState([]);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [address, setAddress] = useState("");
    const [popup, setPopup] = useState(false);
    const [editingId, setEditingId] = useState(null); // NEW: to track editing

    const { data: session, status } = useSession();
    const router = useRouter();

    // ---------------------------
    // LOAD SALES
    // ---------------------------
    async function loadSales() {
        const res = await fetch("/api/getSales");
        const json = await res.json();
        setSales(json.data || []);
    }

    useEffect(() => {
        if (status === "authenticated") loadSales();
    }, [status]);

    // -------------------------------------------
    // REDIRECT IF NOT LOGGED IN
    // -------------------------------------------
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signup");
        }
    }, [status]);

    // -------------------------------------------
    // CREATE OR UPDATE SALE
    // -------------------------------------------
    async function saveSale() {

        if (!/^\d{10}$/.test(phoneNumber)) {
            toast.error("Enter a valid phone number!");
            return;
        }

        if (!session?.user?.email) {
            toast.error("User not logged in.");
            return;
        }

        const body = {
            id: editingId || uuidv4(),
            name,
            phoneNumber,
            email: emailAddress,
            address,
            saleOf: session.user.email.split("@")[0],
            isUpdate: Boolean(editingId)
        };

        const res = await fetch("/api/Sale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        toast.success(data.message);

        resetForm();
        loadSales();
    }

    // -------------------------------------------
    // DELETE SALE
    // -------------------------------------------
    async function deleteSale(id) {
        if (!confirm("Are you sure you want to delete this sale?")) return;

        const res = await fetch("/api/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        const data = await res.json();
        toast.success(data.message);
        loadSales();
    }

    // -------------------------------------------
    // EDIT SALE
    // -------------------------------------------
    function edit(item) {
        setEditingId(item.id);
        setName(item.name);
        setAddress(item.address);
        setPhoneNumber(item.phoneNumber);
        setEmailAddress(item.email);
        setPopup(true);
    }

    // -------------------------------------------
    // RESET FORM
    // -------------------------------------------
    function resetForm() {
        setName("");
        setPhoneNumber("");
        setEmailAddress("");
        setAddress("");
        setEditingId(null);
        setPopup(false);
    }

    // -------------------------------------------

    return (
        <div className="min-h-[100vh] w-full relative bg-[#f3f3f6]">
            <ToastContainer className="z-50" />

            {/* POPUP */}
            <div className={`fixed inset-0 bg-black/50 justify-center items-center ${popup ? "flex" : "hidden"} z-50`}>
                <div className="flex gap-4 flex-col items-center rounded-xl bg-[#f3f3f6] p-10 w-[85vw] md:w-[70vw] h-[85vh] relative">
                    <img
                        onClick={resetForm}
                        className="cursor-pointer absolute right-5 top-5"
                        src="/close.svg"
                        alt="close"
                    />

                    <h2 className="font-bold text-xl text-center">
                        {editingId ? "Edit Client" : "Add a new client"}
                    </h2>

                    <div className="form flex flex-wrap items-center justify-center max-w-[80vw] md:max-w-[65vw] gap-4">
                        <input value={name} onChange={(e) => setName(e.target.value)} className="bg-white rounded-lg p-2 text-lg w-full" placeholder="Client's full name" />
                        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-white rounded-lg p-2 text-lg w-full" placeholder="Client's phone number" />
                        <input value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} className="bg-white rounded-lg p-2 text-lg w-full" placeholder="Client's email address" />
                        <input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-white rounded-lg p-2 text-lg w-full" placeholder="Client's address" />

                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5"
                            onClick={saveSale}
                        >
                            {editingId ? "Update" : "Add"}
                        </button>
                    </div>
                </div>
            </div>

            {/* TOP BAR */}
            <div className="top flex justify-center items-center p-4 w-full gap-3">
                <input className="p-2 text-lg border border-2 border-black rounded-lg" type="text" placeholder="Search clients" />

                <button onClick={() => setPopup(true)} className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 flex items-center gap-1">
                    <img src="/add.svg" alt="add" />Add sale
                </button>

                <div className="flex justify-center items-center gap-3 absolute right-4">
                    <div className="text-white bg-blue-700 rounded-full text-sm px-6 py-2.5">
                        {session?.user?.email}
                    </div>

                    <button onClick={() => signOut()} className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5">
                        Sign Out
                    </button>
                </div>
            </div>

            <hr />

            {/* SALES LIST */}
            <section className="bg-[#f3f3f6]">
                <h2 className="font-bold text-center text-xl">Sales</h2>

                <div className="sales">
                    {sales.map((item) => (
                        <div className="bg-white m-5 flex flex-wrap justify-between items-center rounded-xl p-6" key={item.id}>
                            <div>
                                <h3 className="font-bold text-xl">{item.name}</h3>
                                <div className="flex flex-wrap gap-2 text-lg text-gray">
                                    <p>{item.phoneNumber}</p>
                                    <p>• {item.email}</p>
                                    <p>• {item.address}</p>
                                </div>
                            </div>

                            <div className="actions flex items-center gap-2">
                                <lord-icon
                                    onClick={() => edit(item)}
                                    className="md:w-7 w-5 cursor-pointer"
                                    src="https://cdn.lordicon.com/ntjwyxgv.json"
                                    trigger="hover"
                                ></lord-icon>

                                <lord-icon
                                    onClick={() => deleteSale(item.id)}
                                    className="md:w-7 w-5 cursor-pointer"
                                    src="https://cdn.lordicon.com/xyfswyxf.json"
                                    trigger="hover"
                                ></lord-icon>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Page;
