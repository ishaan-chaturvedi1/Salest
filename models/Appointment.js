import mongoose from "mongoose";
const {Schema , model} = mongoose;

const AppointmentSchema = new Schema({
    name:{type:String, required:true},
    date:{type:String, required:true},
    appointmentOf:{type:String, required:true},
    id:{type:String, required:true},
    remarks: {type:String, required:true},
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type:Date, default: Date.now}
})

export default mongoose.models.Appointment ||  model("Appointment", AppointmentSchema);