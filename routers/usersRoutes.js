import { Router } from "express"
import * as User from "../data/user.js"

const router = Router()

router.get("/", (req, res) => {
  const users = User.getUsers()
  res.status(200).json(users)
})

router.get("/:id", (req, res) => {
  const user = User.getUserById(+req.params.id)
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  res.status(200).json(user)
})

router.post("/", (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing data" })
  }
  const result = User.saveUser(name, email, password)
  const newUser = User.getUserById(result.lastInsertRowid)
  res.status(201).json(newUser)
})

router.put("/:id", (req, res) => {
  let user = User.getUserById(+req.params.id)
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing data" })
  }
  User.updateUser(user.id, name, email, password)
  user = User.getUserById(user.id)
  res.status(200).json(user)
})

router.delete("/:id", (req, res) => {
  const user = User.getUserById(+req.params.id)
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  User.deleteUser(+req.params.id)
  res.status(200).json({ message: "Delete successful" })
})

export default router
