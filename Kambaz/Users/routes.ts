import UsersDao from "./dao";
import EnrollmentsDao from "../Enrollments/dao";
import {
  isStaff, requireUser, requireStaff, requireSelfOrStaff,
} from "../authorize";
export default function UserRoutes(app) {
  const dao = UsersDao();
  const enrollmentsDao = EnrollmentsDao();
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  const deleteUser = async (req, res) => {
    const { userId } = req.params;
    // Remove the enrollments first, so no enrollment refers to a missing user.
    await enrollmentsDao.unenrollUserFromAllCourses(userId);
    const status = await dao.deleteUser(userId);
    res.json(status);
  };
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    const currentUser = req.session["currentUser"];
    // Only faculty and administrators change a role, so a student cannot promote themselves.
    if (!isStaff(currentUser)) {
      delete userUpdates.role;
    }
    await dao.updateUser(userId, userUpdates);
    // Synchronize the session only when the signed-in user is the one who was updated.
    if (currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(req.session["currentUser"]);
  };
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    // Sign up offers only the two roles of the application; anything else becomes a student.
    const role = req.body.role === "FACULTY" ? "FACULTY" : "STUDENT";
    const currentUser = await dao.createUser({ ...req.body, role });
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  app.post("/api/users", requireStaff, createUser);
  app.get("/api/users", requireUser, findAllUsers);
  app.get("/api/users/:userId", requireUser, findUserById);
  app.put("/api/users/:userId", requireSelfOrStaff, updateUser);
  app.delete("/api/users/:userId", requireStaff, deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
