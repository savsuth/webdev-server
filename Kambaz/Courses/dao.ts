import model from "./model";
import { v4 as uuidv4 } from "uuid";
export default function CoursesDao() {
  function findAllCourses() {
    return model.find();
  }
  function findCoursesByAuthor(author) {
    return model.find({ author });
  }
  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  }
  // The author filter makes a delete or an update match nothing for a course someone else created.
  function deleteCourse(courseId, author) {
    return model.deleteOne({ _id: courseId, author });
  }
  function updateCourse(courseId, author, courseUpdates) {
    return model.updateOne({ _id: courseId, author }, { $set: courseUpdates });
  }
  return {
    findAllCourses, findCoursesByAuthor, createCourse, deleteCourse,
    updateCourse,
  };
}
