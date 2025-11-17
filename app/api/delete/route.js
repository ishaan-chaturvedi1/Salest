import Sale from "@/models/Sale";
import connectDB from "@/db/connectDB";
import mongoose from "mongoose";


export async function POST(request) {
  const body = await request.json();
  await connectDB();
  await Sale.deleteOne({id:body})
  
  return Response.json({
    message: "Sale deleted succesfully!",
    data: body
  });
}