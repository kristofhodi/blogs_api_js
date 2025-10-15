import express from "express"
import * as Post from "../data/post.js"
import bcrypt from "bcrypt"
import * as User from "../data/user.js"
import jwt from "jsonwebtoken"

const router = express.Router()

router.get("/", (req, res) => {
  const posts = Post.getPosts()
  res.status(200).json(posts)
})

router.post('/login', (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    res.status(400).json({message: "invalid credits"});
  }
  const user = User.getUserByEmail(email)
  if (!user) {
    return res.status(400).json({message: "invalid creds"})
  }
  // if (!bcrypt.compareSync(password, user.password)) {
  //   return res.status(400).json({message: "invalid creds"})
  // }
  const token = jwt.sign({id : user.id, email : user.email}, 'secret_key', {expiresIn: '30m'})
  res.json({token: token})
})

router.get("/my", (req, res) => {

})

router.get("/:id", (req, res) => {
  const post = Post.getPostById(+req.params.id)
  if (!post) {
    return res.status(404).json({ message: "Post not found" })
  }
  res.status(200).json(post)
})

function auth(req, res, next) {
  const accessToken = req.headers.authorize
  if (!accessToken) {
    return res.status(401).json({message : "nope"})
  }
  const token = jwt.verify(accessToken, "secret_key")
}

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
