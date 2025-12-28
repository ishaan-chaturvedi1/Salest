import Sale from "@/models/Sale";
import connectDB from "@/db/connectDB";
import User from "@/models/User"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  await connectDB();
  await Sale.create(body)
  
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const user = await User.findOne({
    email: session.user.email
  })

  if (user) {
    user.clientSerialNumber = user.clientSerialNumber + 1
    await user.save()
  }


  return Response.json({
    message: "Sale Created",
    data: body
  });
}