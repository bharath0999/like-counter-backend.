const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: [
        "https://project-grykc0va8nbwvtfs0zcq.framercanvas.com",   // Framer preview
        "https://framer.app",                                       // Framer published sites
        "https://your-framer-published-site.framer.website"         // Add your actual published URL here if known
    ]
}))

app.use(express.json())

let likeCount = 0

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
app.listen(PORT, () => console.log(`✅ Like counter running on port ${PORT}`))

