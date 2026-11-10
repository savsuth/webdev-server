import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import Hello from "./Hello";
import Lab5 from "./Lab5/index";
import db from "./Kambaz/Database/index";
import UserRoutes from "./Kambaz/Users/routes";
import CourseRoutes from "./Kambaz/Courses/routes";
import ModuleRoutes from "./Kambaz/Modules/routes";
import AssignmentRoutes from "./Kambaz/Assignments/routes";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes";
const app = express();
// Allow only the React application, and let it send the session cookie.
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  }),
);
const sessionOptions: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
// In production the client and server are on different sites, so the cookie must be cross-site and secure.
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    // Partitioned lets browsers that block third-party cookies keep this one for the client site.
    partitioned: true,
    domain: process.env.SERVER_URL,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000);
