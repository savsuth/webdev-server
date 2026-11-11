import mongoose from "mongoose";
const schema = new mongoose.Schema({
  _id: String,
  title: String,
  course: String,
  description: String,
  points: Number,
  due: String,
  available: String,
  until: String,
},
{ collection: "assignments" });
export default schema;
