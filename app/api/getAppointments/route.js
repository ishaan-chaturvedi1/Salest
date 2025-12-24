import connectDB from "@/db/connectDB";
import Appointment from "@/models/Appointment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const appointments = await Appointment.find({
    appointmentOf: session.user.email.split("@")[0]
  });

  return Response.json({
    message: "Got the Appointments!",
    data: appointments
  });
}
