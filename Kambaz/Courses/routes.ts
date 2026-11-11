import CoursesDao from "./dao";
import EnrollmentsDao from "../Enrollments/dao";
import { requireUser, requireFaculty } from "../authorize";
export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  };
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      // A faculty member's courses are the ones they created, not the ones they are enrolled in.
      if (currentUser.role === "FACULTY") {
        const courses = await dao.findCoursesByAuthor(currentUser._id);
        res.json(courses);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };
  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };
  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = await dao.createCourse({
      ...req.body,
      author: currentUser._id,
    });
    // The creator is also enrolled, so the course People screen lists them.
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    const status = await dao.deleteCourse(courseId, currentUser._id);
    if (status.deletedCount === 0) {
      res.sendStatus(403);
      return;
    }
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    res.send(status);
  };
  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const currentUser = req.session["currentUser"];
    const status = await dao.updateCourse(courseId, currentUser._id, courseUpdates);
    if (status.matchedCount === 0) {
      res.sendStatus(403);
      return;
    }
    res.send(status);
  };
  app.get("/api/courses", requireUser, findAllCourses);
  app.get("/api/users/:userId/courses", requireUser, findCoursesForEnrolledUser);
  app.get("/api/courses/:cid/users", requireUser, findUsersForCourse);
  app.post("/api/courses", requireFaculty, createCourse);
  app.post("/api/users/current/courses", requireFaculty, createCourse);
  app.delete("/api/courses/:courseId", requireFaculty, deleteCourse);
  app.put("/api/courses/:courseId", requireFaculty, updateCourse);
}
