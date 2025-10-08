import { Router } from "express";
import * as User from "../data/user.js"


const router = Router()

router.get("/", (req, res) => {
    const users = User.getUsers()
    res.json(users)
})

export default router