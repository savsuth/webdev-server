import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("AssignmentModel", schema);
export default model;
