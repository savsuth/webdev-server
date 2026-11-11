import EnrollmentsDao from "./dao";
export default function EnrollmentRoutes(app) {
  const dao = EnrollmentsDao();
  const enrollUserInCourse = async (req, res) => {
    const { userId, courseId } = req.params;
    const status = await dao.enrollUserInCourse(userId, courseId);
    res.send(status);
  };
  const unenrollUserFromCourse = async (req, res) => {
    const { userId, courseId } = req.params;
    const status = await dao.unenrollUserFromCourse(userId, courseId);
    res.send(status);
  };
  app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
}
