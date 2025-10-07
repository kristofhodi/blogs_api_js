import express from "express"
import cors from "cors"
import postRoutes from "./routers/postRoutes.js"
import usersRoutes from "./routers/usersRoutes.js"


const PORT = 3000
const app = express()

app.use(express.json())
app.use(cors())

app.use("/posts", postRoutes)
app.use("/users", usersRoutes)

app.listen(PORT, () => {
    console.log(`Server runs on ${PORT}`)
})