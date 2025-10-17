import { Router } from "express";
import * as User from "../data/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../util/authentication.js";

const router = Router();

router.get("/", (req, res) => {
  const users = User.getUsers();
  res.status(200).json(users);
});

router.get("/me", auth, (req, res) => {
  const user = User.getUserById(+req.params.id);
  delete user.password;
  res.status(200).json(user);
});

router.post("/", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing data" });
  }
  const result = User.saveUser(name, email, password);
  const newUser = User.getUserById(result.lastInsertRowid);
  res.status(201).json(newUser);
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "invalid credits" });
  }
  let user = User.getUserByEmail(email);
  if (user) {
    res.status(400).json({ message: "email already exists" });
  }
  const salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const saved = User.saveUser(name, email, hashedPassword);
  user = User.getUserById(saved.lastInsertRowid);
  delete user.password;
  res.status(201).json(user);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "invalid credits" });
  }
  const user = User.getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "invalid creds" });
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "invalid creds" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, "secret_key", {
    expiresIn: "30s",
  });
  res.json({ token: token });
});

router.patch("/:id", auth, (req, res) => {
  const id = +req.params.id;
  if (id != +req.params.id) {
    res.status(400).json({ message: "invalid user id" });
  }
  const { name, email, password } = req.body;
  let user = User.getUserById(id);
  let hashedPassword;
  if (password) {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);
  }
  User.updateUser(
    id,
    name || user.name,
    email || user.email,
    hashedPassword || user.password
  );
  user = User.getUserById(id);
  delete user.password;
  res.status(201).json(user);
});

router.put("/:id", (req, res) => {
  let user = User.getUserById(+req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing data" });
  }
  User.updateUser(user.id, name, email, password);
  user = User.getUserById(user.id);
  res.status(200).json(user);
});

router.delete("/:id", (req, res) => {
  const user = User.getUserById(+req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  User.deleteUser(+req.params.id);
  res.status(200).json({ message: "Delete successful" });
});

export default router;
