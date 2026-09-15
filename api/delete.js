import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "Missing public_id" });
  }

  const timestamp = Math.floor(Date.now() / 1000);

  const signatureString =
    `public_id=${public_id}&timestamp=${timestamp}` +
    process.env.CLOUDINARY_API_SECRET;

  const signature = crypto
    .createHash("sha1")
    .update(signatureString)
    .digest("hex");

  const formData = new URLSearchParams();

  formData.append("public_id", public_id);
  formData.append("timestamp", timestamp);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY);
  formData.append("signature", signature);
  formData.append("invalidate", "true");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/destroy`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  return res.status(response.ok ? 200 : 400).json(data);
}
