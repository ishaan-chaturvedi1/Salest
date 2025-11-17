import connectDB from "@/db/connectDB";
import Sale from "@/models/Sale";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const sales = await Sale.find({
    saleOf: session.user.email.split("@")[0]
  });

  return Response.json({
    message: "Got the sales!",
    data: sales
  });
}
