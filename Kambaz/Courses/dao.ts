import model from "./model";
import { v4 as uuidv4 } from "uuid";
export default function CoursesDao() {
  function findAllCourses() {
    return model.find();
  }
  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  }
  function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });
  }
  function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }
  return { findAllCourses, createCourse, deleteCourse, updateCourse };
}
