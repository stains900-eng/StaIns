import crypto from "crypto";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ error: "Missing public_id" });
    }

    const db = getFirestore();
    const snapshot = await db
      .collection("videos")
      .where("publicId", "==", public_id)
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(403).json({ error: "You cannot delete this video" });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const signatureString =
      `invalidate=true&public_id=${public_id}&timestamp=${timestamp}` +
      process.env.CLOUDINARY_API_SECRET;

    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    const formData = new URLSearchParams();

    formData.append("public_id", public_id);
    formData.append("timestamp", timestamp);
    formData.append("invalidate", "true");
    formData.append("api_key", process.env.CLOUDINARY_API_KEY);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/destroy`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok || data.result !== "ok") {
      return res.status(400).json(data);
    }

    await snapshot.docs[0].ref.delete();

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      error: "Delete failed"
    });
  }
      }
