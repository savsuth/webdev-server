import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("EnrollmentModel", schema);
export default model;
