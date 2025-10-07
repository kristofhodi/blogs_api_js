import { Router } from "express";
import * as User from "../data/user.js"


const router = Router()

router.get("/", (req, res) => {
    res.send('Users')
})

export default router