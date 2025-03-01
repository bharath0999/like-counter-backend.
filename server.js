const express = require('express')
const cors = require('cors')

const app = express()

// Allow all origins for now (you can restrict it later to your specific Framer domain if needed)
app.use(cors({
    origin: "*"
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

