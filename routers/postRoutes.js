import express from "express"
import * as Post from "../data/post.js"

const router = express.Router()

router.get("/", (req, res) => {
  const posts = Post.getPosts()
  res.status(200).json(posts)
})

router.get("/:id", (req, res) => {
  const post = Post.getPostById(+req.params.id)
  if (!post) {
    return res.status(404).json({ message: "Post not found" })
  }
  res.status(200).json(post)
})

router.post("/", (req, res) => {
  const { title, content, userId } = req.body
  if (!title || !content || !userId) {
    return res.status(400).json({ message: "Missing data" })
  }
  const result = Post.savePost(title, content, userId)
  const newPost = Post.getPostById(result.lastInsertRowid)
  res.status(201).json(newPost)
})

router.put("/:id", (req, res) => {
  let post = Post.getPostById(+req.params.id)
  if (!post) {
    return res.status(404).json({ message: "Post not found" })
  }
  const { title, content } = req.body
  if (!title || !content) {
    return res.status(400).json({ message: "Missing data" })
  }
  Post.updatePost(post.id, title, content)
  post = Post.getPostById(post.id)
  res.status(200).json(post)
})

router.delete("/:id", (req, res) => {
  const post = Post.getPostById(+req.params.id)
  if (!post) {
    return res.status(404).json({ message: "Post not found" })
  }
  Post.deletePost(+req.params.id)
  res.status(200).json({ message: "Delete successful" })
})

export default router
