import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("CourseModel", schema);
export default model;
