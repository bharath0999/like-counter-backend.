const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())

// Flexible CORS - works for all Framer preview & published projects
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.endsWith(".framercanvas.com") || origin.endsWith(".framer.website")) {
            callback(null, true)
        } else {
            console.log("Blocked by CORS:", origin)
            callback(new Error("Not allowed by CORS"))
        }
    }
}))

let likeCount = 0 // This is temporary (resets if server restarts)

app.get('/likes', (req, res) => {
    res.json({ count: likeCount })
})

app.post('/likes', (req, res) => {
    const { action } = req.body
    if (action === 'like') {
        likeCount++
    } else if (action === 'unlike') {
        likeCount = Math.max(0, likeCount - 1)
    }
    res.json({ count: likeCount })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`✅ Like counter server running on port ${PORT}`))
