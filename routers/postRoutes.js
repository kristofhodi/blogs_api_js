import express from "express"
import * as Post from "../data/post.js"

const router = express.Router()

router.get("/", (req, res) => {
    const posts = Post.getPosts()
    res.json(posts)
})

export default router