import * as User from "../data/user.js";
import jwt from "jsonwebtoken";

function auth(req, res, next) {
  try {
    const accessToken = req.headers.authorize;
    if (!accessToken) {
      return res.status(401).json({ message: "nope" });
    }
    const token = jwt.verify(accessToken.split("")[1], "secret_key");
    const now = Math.floor(Date.now() / 1000);
    if (!token || token.exp ||token.exp < now) {
      return res.status(403).json({ message: "access denied" });
    }
    const user = User.getUserById(token.id);
    if (!user) {
      return res.status(403).json({ message: "access denied" });
    }
    req.userId = user.id;
    req.userEmail = user.userEmail;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default auth;
