/***************************************************************
 * server.js
 * 
 * This file uses:
 * - Express for HTTP endpoints
 * - CORS for cross-origin requests
 * - Firebase Admin SDK (via environment variable credentials)
 * - Firestore to store and retrieve the like count
 ***************************************************************/

const express = require("express")
const cors = require("cors")
const admin = require("firebase-admin")

// 1) Parse service account JSON from an environment variable
//    e.g., in Render, set SERVICE_ACCOUNT_KEY as an environment variable
//    containing the entire JSON key.
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY)

// 2) Initialize Firebase Admin SDK using these credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// 3) Reference your Firestore database
const db = admin.firestore()

const app = express()
app.use(express.json())

// 4) Flexible CORS setup (adjust as needed)
app.use(
  cors({
    origin: function (origin, callback) {
      // For example, allow all framercanvas.com, framer.app, and .com
      if (
        !origin ||
        origin.endsWith(".framercanvas.com") ||
        origin.endsWith(".framer.app") ||
        origin.endsWith(".com")
      ) {
        callback(null, true)
      } else {
        console.log("Blocked by CORS:", origin)
        callback(new Error("Not allowed by CORS"))
      }
    },
  })
)

// 5) Firestore doc reference: e.g., likes/likeCount
const docRef = db.collection("likes").doc("likeCount")

/***************************************************************
 * GET /likes
 * - Returns the current like count from Firestore.
 ***************************************************************/
app.get("/likes", async (req, res) => {
  try {
    const docSnap = await docRef.get()
    if (docSnap.exists) {
      res.json({ count: docSnap.data().count })
    } else {
      // If the doc doesn't exist, create it with a count of 0
      await docRef.set({ count: 0 })
      res.json({ count: 0 })
    }
  } catch (error) {
    console.error("Error reading like count:", error)
    res.status(500).send("Error reading like count")
  }
})

/***************************************************************
 * POST /likes
 * - Accepts a JSON body with { action: "like" } or { action: "unlike" }
 * - Atomically updates the Firestore document.
 ***************************************************************/
app.post("/likes", async (req, res) => {
  const { action } = req.body
  try {
    // Use a transaction for atomic updates
    await db.runTransaction(async (transaction) => {
      const docSnap = await transaction.get(docRef)
      let currentCount = docSnap.exists ? docSnap.data().count : 0

      if (action === "like") {
        currentCount++
      } else if (action === "unlike") {
        currentCount = Math.max(0, currentCount - 1)
      }
      transaction.update(docRef, { count: currentCount })
    })

    // After the transaction, fetch and return the updated count
    const updatedDoc = await docRef.get()
    res.json({ count: updatedDoc.data().count })
  } catch (error) {
    console.error("Error updating like count:", error)
    res.status(500).send("Error updating like count")
  }
})

/***************************************************************
 * Start the server
 ***************************************************************/
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`✅ Like counter server running on port ${PORT}`)
})
