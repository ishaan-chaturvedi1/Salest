import mongoose from "mongoose";
const {Schema , model} = mongoose;

const SaleSchema = new Schema({
    name: {type:String, required:true},
    phoneNumber: {type:Number, required:true},
    email: {type:String, required:true},
    address: {type:String, required:true},
    saleOf: {type:String, required: true},
    id:{type:String, required:true},
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type:Date, default: Date.now}
})

export default mongoose.models.Sale ||  model("Sale", SaleSchema);