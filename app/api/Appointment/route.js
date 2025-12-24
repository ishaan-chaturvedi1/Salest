import Appointment from "@/models/Appointment";
import connectDB from "@/db/connectDB";

export async function POST(request) {
  const body = await request.json();
  await connectDB();
  await Appointment.create(body)
  
  return Response.json({
    message: "Appointment Created",
    data: body
  });
}