// Faculty and administrators manage other users.
export const isStaff = (user) => ["FACULTY", "ADMIN"].includes(user.role);
// Build a route guard that answers 401 without a session and 403 when the role is not allowed.
const requireRole = (...roles) => (req, res, next) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(401);
    return;
  }
  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    res.sendStatus(403);
    return;
  }
  next();
};
export const requireUser = requireRole();
export const requireFaculty = requireRole("FACULTY");
export const requireStaff = requireRole("FACULTY", "ADMIN");
// A user may act on their own record; faculty and administrators may act on anyone's.
export const requireSelfOrStaff = (req, res, next) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(401);
    return;
  }
  if (currentUser._id !== req.params.userId && !isStaff(currentUser)) {
    res.sendStatus(403);
    return;
  }
  next();
};
