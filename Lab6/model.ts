import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("TodoModel", schema);
export default model;
