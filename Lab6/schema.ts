import mongoose from "mongoose";
const todoSchema = new mongoose.Schema({
  _id: String,
  title: String,
  description: String,
  completed: { type: Boolean, default: false },
},
{ collection: "todos" });
export default todoSchema;
