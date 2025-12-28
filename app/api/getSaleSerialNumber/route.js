import connectDB from "@/db/connectDB";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({
    email: session.user.email
  })

  const sn = user.clientSerialNumber

  return Response.json({
    message: "Got the Serial Number!",
    data: sn
  });
}
