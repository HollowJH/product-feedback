import express from "express"
import "dotenv/config"
import { getFeedback } from "./mysql.js"

const app = express()

const ACCEPTED_DOMAINS = [
    "http://localhost:3000/",
    "http://localhost:5500/",
    "http://localhost:5173"
]

app.use((req, res, next) => {
    const origin = req.header("origin")
    if (ACCEPTED_DOMAINS.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin)
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", "true");
        
        if (req.method === "OPTIONS") {
            return res.sendStatus(200); // End the response for preflight
        }
    }
    
    next()
})
app.use(express.json())
app.disable("x-powered-by")

app.get("/", async (req, res) => {
    const posts = await getFeedback()
    const overview = {
        totalPosts: posts.length,
        postByStatus: {
            planned: posts.filter(e => e.status = "Planned").length,
            inProgress: posts.filter(e => e.status = "In-Progress").length,
            live: posts.filter(e => e.status = "Live").length,
            suggestion: posts.filter(e => e.status = "Suggestion").length
        }
    }
    
    res.send([posts, overview])
})

app.listen(process.env.PORT, () => {
    console.log(`Up n' runnin' on port http://localhost:${process.env.PORT}`)
})