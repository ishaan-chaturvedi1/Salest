import Sale from "@/models/Sale";
import connectDB from "@/db/connectDB";


export async function POST(request) {
  const body = await request.json();
  await connectDB();
  await Sale.create(body)
  
  return Response.json({
    message: "Sale Created",
    data: body
  });
}