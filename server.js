const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault() // Ensure your environment is set up with proper credentials
});
const db = admin.firestore();

const app = express()
app.use(express.json())

// Flexible CORS - works for all Framer preview & published projects
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.endsWith(".framercanvas.com") || origin.endsWith(".framer.app") || origin.endsWith(".com")) {
            callback(null, true)
        } else {
            console.log("Blocked by CORS:", origin)
            callback(new Error("Not allowed by CORS"))
        }
    }
}))

// Instead of an in-memory likeCount, use a Firestore document:
const docRef = db.collection("likes").doc("likeCount")

app.get('/likes', async (req, res) => {
    try {
        const docSnap = await docRef.get()
        if (docSnap.exists) {
            res.json({ count: docSnap.data().count })
        } else {
            // If the document doesn't exist, create it with count = 0
            await docRef.set({ count: 0 })
            res.json({ count: 0 })
        }
    } catch (error) {
        console.error("Error reading like count:", error)
        res.status(500).send("Error reading like count")
    }
})

app.post('/likes', async (req, res) => {
    const { action } = req.body
    try {
        await db.runTransaction(async (transaction) => {
            const docSnap = await transaction.get(docRef)
            let currentCount = docSnap.exists ? docSnap.data().count : 0
            if (action === 'like') {
                currentCount++
            } else if (action === 'unlike') {
                currentCount = Math.max(0, currentCount - 1)
            }
            transaction.update(docRef, { count: currentCount })
        })
        const updatedDoc = await docRef.get()
        res.json({ count: updatedDoc.data().count })
    } catch (error) {
        console.error("Error updating like count:", error)
        res.status(500).send("Error updating like count")
    }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`✅ Like counter server running on port ${PORT}`))
