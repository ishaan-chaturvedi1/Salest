"use client"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

const DashboardHome = () => {

    const [sales, setSales] = useState([]);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [meterLoad, setMeterLoad] = useState(0);
    const [address, setAddress] = useState("");
    const [popup, setPopup] = useState(false);
    const [appointmentPopup, setAppointmentPopup] = useState(false);
    const [mailPopup, setMailPopup] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [appointmentRemarks, setAppointmentRemarks] = useState("");
    const [appointmentClient, setAppointmentClient] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");
    const [clientPopup, setClientPopup] = useState(false);
    const [selectedClient, setSelectedClient] = useState({});
    const [appointmentSort, setAppointmentSort] = useState("today");
    const [deletePopup, setDeletePopup] = useState(false);
    const [deletingSale, setDeletingSale] = useState(null);
    const [editId, setEditId] = useState("");

    const searchInput = useRef();

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        loadAppointments()
    }, [])


    async function loadSales() {
        const res = await fetch("/api/getSales");
        const json = await res.json();
        setSales(json.data || []);
    }

    function openClientDetails(client) {
        setSelectedClient(client)
        setClientPopup(true)
    }

    async function getSerialNumber() {
        let res = await fetch("/api/getSaleSerialNumber", { method: "GET", headers: { "Content-Type": "application/json" } })
        let json = await res.json()
        return Number(json.data)
    }


    async function loadAppointments() {
        const res = await fetch("/api/getAppointments");
        const json = await res.json();
        setAppointments(json.data || []);
    }

    useEffect(() => {
        if (status === "authenticated") loadSales();
    }, [status]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signup");
        }
    }, [status]);

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
            meterLoadInKw: meterLoad,
            address,
            saleOf: session.user.email.split("@")[0],
            isUpdate: Boolean(editingId),
            remarks,
            sn: await getSerialNumber()
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

    async function deleteSale(id) {
        const res = await fetch("/api/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        const data = await res.json();
        toast.success(data.message);
        loadSales();
    }

    async function edit(item, id) {
        setEditingId(item.id);
        setName(item.name);
        setAddress(item.address);
        setPhoneNumber(item.phoneNumber);
        setMeterLoad(item.meterLoadInKw);
        setPopup(true);
        setRemarks(item.remarks)
        setEditId(id)
    }

    async function deleteSaleWithoutToast(id) {
        const res = await fetch("/api/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        const data = await res.json();
        loadSales();
    }

    function resetForm() {
        setName("");
        setPhoneNumber("");
        setMeterLoad(0);
        setAddress("");
        setEditingId(null);
        setPopup(false);
        setRemarks("");
        setAppointmentRemarks("");
        setAppointmentDate("");
        setAppointmentClient("");
        setAppointmentPopup(false)
        setMailPopup(false)
        setClientPopup(false)
        setDeletePopup(false)
    }

    async function saveAppointment() {
        if (appointmentClient == '') {
            toast.error("Select a Client!")
            return;
        }
        if (appointmentDate == '') {
            toast.error("Select a Date!")
            return;
        }
        if (appointmentRemarks == '') {
            toast.error("Give a Remark!")
            return;
        }
        if (!session?.user?.email) {
            toast.error("User not logged in.");
            return;
        }

        const body = {
            id: uuidv4(),
            date: appointmentDate,
            appointmentOf: session.user.email.split("@")[0],
            remarks: appointmentRemarks,
            name: appointmentClient
        };

        const res = await fetch("api/Appointment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })

        const data = await res.json();
        toast.success(data.message)

        resetForm();
        loadAppointments();
    }

    function showDeletePopup(id) {
        setDeletingSale(id)
        setDeletePopup(true)
    }

    function hasDatePassed(dateStr) {
        if (!dateStr) return false

        const inputDate = new Date(dateStr)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return inputDate < today
    }

    function getNext3DaysAppointments(appointments) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const day3 = new Date(today)
        day3.setDate(today.getDate() + 3)

        return appointments.filter(item => {
            if (!item.date) return false

            const appointmentDate = new Date(item.date)
            appointmentDate.setHours(0, 0, 0, 0)

            return appointmentDate > today && appointmentDate <= day3
        })
    }

    useEffect(() => {
        function handlekeydown(e) {
            if (e.key === "Escape") resetForm()
        }

        window.addEventListener("keydown", handlekeydown)
        return () => window.removeEventListener("keydown", handlekeydown)
    }, []);


    const displayedSales = search
        ? [
            ...sales.filter(item => {
                const q = search.toLowerCase()

                return (
                    String(item.name || "").toLowerCase().includes(q) ||
                    String(item.phoneNumber || "").includes(q) ||
                    String(item.address || "").toLowerCase().includes(q)
                )
            }),
            ...sales.filter(item => {
                const q = search.toLowerCase()

                return !(
                    String(item.name || "").toLowerCase().includes(q) ||
                    String(item.phoneNumber || "").includes(q) ||
                    String(item.address || "").toLowerCase().includes(q)
                )
            }),
        ]
        : sales

    function getTodayYYYYMMDD() {
        return new Date().toISOString().split("T")[0]
    }

    function isToday(dateStr) {
        if (!dateStr) return false

        const d = new Date(dateStr)
        const today = new Date()

        return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
        )
    }



    let filteredAppointments = appointments.filter(item => {
        const isPast = hasDatePassed(item.date)

        if (appointmentSort === "previous") {
            return isPast
        }

        if (isPast) return false

        if (appointmentSort === "today") {
            return isToday(item.date)
        }

        return true // "all"
    })

    if (appointmentSort === "next3") {
        filteredAppointments = getNext3DaysAppointments(filteredAppointments)
    }


    function edit2(id) {
        saveSale()
        deleteSaleWithoutToast(id)
        setEditId("")
    }

    return (
        <div className="min-h-[100vh] ml-14 w-full relative bg-[#f3f3f6]">
            <ToastContainer className="z-50" />

            {/* APPOINTMENT POPUP */}
            <div className={`fixed popup inset-0 bg-black/50 justify-center items-center ${appointmentPopup ? "flex" : "hidden"} z-50`}>
                <div className="flex gap-4 flex-col items-center rounded-xl bg-[#f3f3f6] p-10 w-[85vw] md:w-[70vw] h-[85vh] relative">
                    <img
                        onClick={resetForm}
                        className="cursor-pointer absolute right-5 top-5"
                        src="/close.svg"
                        alt="close"
                    />

                    <h2 className="font-bold text-xl text-center">
                        Create an Appointment
                    </h2>

                    <div className="form flex flex-wrap flex-col items-center justify-center max-w-[80vw] md:max-w-[65vw] gap-4">
                        <div className="flex justify-center items-center flex-col gap-2">
                            <select value={appointmentClient} onChange={(e) => { setAppointmentClient(e.target.value) }} className="bg-white p-2 px-3 rounded-lg" name="clients" id="clients">
                                <option value="">Choose Client</option>
                                {sales.map((item) => (
                                    <option key={item.id} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                            <input value={appointmentDate} onChange={(e) => { setAppointmentDate(e.target.value) }} className="bg-white p-2 px-3 rounded-lg" type="date" />
                            <input value={appointmentRemarks} onChange={(e) => { setAppointmentRemarks(e.target.value) }} type="text" name="appointmentRemarks" id="appointmentRemarks" className="p-2 bg-white rounded-lg" placeholder="Remarks of appointment" />
                            <button
                                className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5"
                                onClick={saveAppointment}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*Delete Popup*/}
            <div className={`fixed popup inset-0 bg-black/50 justify-center items-center ${deletePopup ? "flex" : "hidden"} z-50`}>
                <div className="flex gap-8 flex-col items-center rounded-xl bg-[#f3f3f6] p-10 w-[50vw] md:w-[35vw] h-[30vh] relative">
                    <h2 className="font-bold text-2xl text-center">
                        Are you sure?
                    </h2>
                    <div className="flex gap-3 text-lg justify-center items-center">
                        <button onClick={() => { setDeletePopup(false) }} className="p-3 text-gray bg-white cursor-pointer rounded-lg">Cancel</button>
                        <button onClick={() => { setDeletePopup(false), deleteSale(deletingSale) }} className="p-3 cursor-pointer text-white bg-[#c70000] rounded-lg">Delete</button>
                    </div>
                </div>
            </div>
            {/*Mail popup*/}
            <div className={`fixed popup inset-0 bg-black/50 justify-center items-center ${mailPopup ? "flex" : "hidden"} z-50`}>
                <div className="flex overflow-y-scroll overflow-x-hidden gap-4 flex-col items-center rounded-xl bg-[#f3f3f6] p-10 w-[85vw] md:w-[70vw] h-[85vh] relative">
                    <img
                        onClick={resetForm}
                        className="cursor-pointer absolute right-5 top-5"
                        src="/close.svg"
                        alt="close"
                    />

                    <div className="flex gap-2 text-xs absolute right-20 top-5">
                        <input
                            id="previousOption"
                            type="radio"
                            name="sortAppointments"
                            value="previous"
                            checked={appointmentSort === "previous"}
                            onChange={() => setAppointmentSort("previous")}
                        />
                        <label htmlFor="previousOption">Previous</label>
                        <input
                            id="allOption"
                            type="radio"
                            name="sortAppointments"
                            value="all"
                            checked={appointmentSort === "all"}
                            onChange={() => setAppointmentSort("all")}
                        />
                        <label htmlFor="allOption">All</label>
                        <input
                            id="todayOption"
                            type="radio"
                            name="sortAppointments"
                            value="today"
                            checked={appointmentSort === "today"}
                            onChange={() => setAppointmentSort("today")}
                        />
                        <label htmlFor="todayOption">Today</label>
                        <input
                            id="next3Option"
                            type="radio"
                            name="sortAppointments"
                            value="next3"
                            checked={appointmentSort === "next3"}
                            onChange={() => setAppointmentSort("next3")}
                        />
                        <label htmlFor="next3Option">Next 3 days</label>
                    </div>

                    <h2 className="font-bold text-xl text-center">
                        Appointments
                    </h2>

                    {filteredAppointments.length < 1 ? <p>No appointments to display</p> : filteredAppointments.map((item) => {
                        return < div key={item.id} className="bg-white m-5 my-2 flex flex-col justify-center w-full items-center rounded-xl p-6" >
                            <h3 className="font-bold text-xl">{item.name} • {item.date}</h3>
                            <p className="text-lg text-gray">{item.remarks}</p>
                        </div>
                    })}

                </div>
            </div>
            {/*Client Details Popup*/}
            <div className={`fixed popup inset-0 bg-black/50 justify-center items-center ${clientPopup ? "flex" : "hidden"} z-50`}>
                <div className="flex overflow-y-scroll overflow-x-hidden gap-4 flex-col items-center rounded-xl bg-[#f3f3f6] p-10 w-[85vw] md:w-[70vw] h-[85vh] relative">
                    <img
                        onClick={resetForm}
                        className="cursor-pointer absolute right-5 top-5"
                        src="/close.svg"
                        alt="close"
                    />

                    <h2 className="font-bold text-xl text-center">
                        Client Details
                    </h2>

                    {selectedClient && (
                        <div className="bg-white rounded-lg p-6 flex flex-col gap-3 m-3 text-lg min-w-full">
                            <p>Name - {selectedClient.name}</p>
                            <p>Phone - {selectedClient.phoneNumber}</p>
                            <p>Address - {selectedClient.address}</p>
                            <p>Meter load - {selectedClient.meterLoadInKw} Kw</p>
                            <p>Remarks - {selectedClient.remarks}</p>
                            <p>
                                Created at -{" "}
                                {selectedClient?.createdAt
                                    ? selectedClient.createdAt.split("T")[0]
                                    : "—"}
                            </p>

                        </div>
                    )}

                    <h3 className="font-bold text-xl text-center">Appointments</h3>


                    {filteredAppointments.map((item) => {
                        return item.name == selectedClient.name && < div key={item.id} className="bg-white m-5 my-2 flex flex-col justify-center w-full items-center rounded-xl p-6" >
                            <h3 className="font-bold text-xl">{item.name} • {item.date}</h3>
                            <p className="text-lg text-gray">{item.remarks}</p>
                        </div>
                    })}

                </div>
            </div>

            {/* ADD / EDIT POPUP */}
            <div className={`fixed popup inset-0 bg-black/50 justify-center items-center ${popup ? "flex" : "hidden"} z-50`}>
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
                        <input value={meterLoad} onChange={(e) => setMeterLoad(Number(e.target.value))} className="bg-white rounded-lg p-2 text-lg w-full" placeholder="Client's meter load" />
                        <input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-white rounded-lg p-2 text-lg w-full" placeholder="Client's address" />
                        <input value={remarks} onChange={(e) => setRemarks(e.target.value)} className="bg-white rounded-lg p-2 text-lg w-full" placeholder="Remarks" />
                        {editId == "" ? <button
                            className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5"
                            onClick={saveSale}
                        >
                            Add
                        </button> : <button
                            className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5"
                            onClick={() => { edit2(editId) }}
                        >
                            Edit
                        </button>}
                    </div>
                </div>
            </div>

            {/* TOP BAR */}
            <div className="sticky top-0 bg-white z-21">
                <div className="top flex justify-center items-center gap-2 p-2 md:p-4 w-full md:gap-3 bg-white">
                    <div className="absolute left-4 flex justify-center p-4 items-center gap-4">
                        <button onClick={() => setAppointmentPopup(true)} className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 rounded-full text-sm px-5 py-2.5">
                            Add Appointment
                        </button>
                        <button onClick={() => { setMailPopup(true) }} className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 rounded-full text-sm px-5 py-2.5">
                            <img className="invert" src="/mail.svg" alt="mail box" />
                        </button>
                    </div>

                    <input
                        className="p-2 text-lg border border-2 border-black rounded-lg"
                        type="text"
                        placeholder="Search clients"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        ref={searchInput}
                    />

                    <button onClick={() => setPopup(true)} className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 flex items-center gap-1">
                        <img src="/add.svg" alt="add" />Add sale
                    </button>

                    <div className="flex justify-center items-center gap-3 md:absolute md:right-4 bg-white">
                        <div className="text-white bg-blue-700 hidden md:block rounded-full text-sm px-6 py-2.5">
                            {session?.user?.email}
                        </div>

                        <button onClick={() => signOut()} className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 rounded-full text-sm px-5 py-2.5">
                            Sign Out
                        </button>
                    </div>
                </div>
                <hr />
            </div>


            {/* SALES LIST */}
            <section className="bg-[#f3f3f6]">
                <h2 className="font-bold text-center text-xl">Sales</h2>

                <div className="sales">
                    {displayedSales.map((item) => (
                        <div className="bg-white m-5 flex flex-wrap justify-between items-center rounded-xl p-6" key={item.id}>
                            <div>
                                <h3 onClick={(e) => { openClientDetails(item) }} className="font-bold cursor-pointer text-xl">{item.name}</h3>
                                <div className="flex flex-wrap gap-2 text-lg text-gray">
                                    <p>{item.phoneNumber}</p>
                                    <p>• {item.meterLoadInKw}Kw</p>
                                    <p>• Remarks - {item.remarks}</p>
                                    <p>• Sn - {item.sn}</p>
                                </div>
                            </div>

                            <div className="actions flex items-center gap-2">
                                <lord-icon
                                    onClick={() => edit(item, item.id)}
                                    className="md:w-7 w-5 cursor-pointer"
                                    src="https://cdn.lordicon.com/ntjwyxgv.json"
                                    trigger="hover"
                                ></lord-icon>

                                <lord-icon
                                    onClick={() => showDeletePopup(item.id)}
                                    className="md:w-7 w-5 cursor-pointer"
                                    src="https://cdn.lordicon.com/xyfswyxf.json"
                                    trigger="hover"
                                ></lord-icon>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div >
    );
};

export default DashboardHome;
export const dynamic = "force-dynamic";
