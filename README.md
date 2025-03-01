# Framer Like Button Backend

This repository contains a **simple backend service** designed to power a Like Button component in Framer. 

It stores a **live like count** and allows Framer components to:

- ✅ Fetch the current like count.
- ✅ Increment (like) and decrement (unlike) the count.
- ✅ Works with any Framer preview or published site.
- ✅ Supports flexible styling and animations inside Framer.

---

## 🚀 Features

- Simple **Node.js & Express** backend.
- **In-memory like counter** (resets if the server restarts).
- Supports **real-time fetching of likes from Framer projects**.
- Works in **Framer Preview & Published modes**.
- **CORS automatically allows any Framer project (no code changes needed)**.
- Built-in support for **like and unlike actions**.

---

## 🛠️ How to Deploy on Render

1. **Fork this repository** to your own GitHub account.
2. Go to [Render.com](https://render.com) and create a new **Web Service**.
3. Choose the **Forked GitHub Repository** as the source.
4. Set these Render settings:

| Setting            | Value                  |
|--------------------|----------------------|
| **Environment**     | Node |
| **Build Command**   | *(leave blank)* |
| **Start Command**   | `node server.js` |
| **Auto Deploy**     | ✅ Enabled |
| **Port**            | 8080 |

5. Click **Deploy**.
6. After deployment, Render will give you a public URL like:https://your-like-button-service.onrender.com

7. Use this URL in your Framer project’s **Like Button component**.

---

## 🔗 How to Connect to Framer

1. In your Framer project, create a **Code Component** for the Like Button.
2. Use the provided **`LikeButton.tsx`** file (see this repo).
3. Update the `API_URL` in the component to your **Render URL**, for example:

```javascript
const API_URL = "https://your-like-button-service.onrender.com"
4.Publish your Framer project — the like button will now:
✅ Fetch live likes
✅ Support clicking to like/unlike
✅ Sync counts across users (on refresh)

/server.js       // Main server logic (like storage & API routes)
/package.json    // Dependencies & start command
/README.md       // This document
