import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZhmn4Kfl4WWM5MMD_qwynSfxaFxtLEA8",
  authDomain: "fishbool.firebaseapp.com",
  projectId: "fishbool",
  storageBucket: "fishbool.firebasestorage.app",
  messagingSenderId: "843704831923",
  appId: "1:843704831923:web:10d42fabfd339a6c54c5c6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const uploadButton = document.getElementById("up");

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "video/*";
fileInput.style.display = "none";

document.body.appendChild(fileInput);

let currentUser = null;

onAuthStateChanged(auth, user => {
  currentUser = user;
});

uploadButton.addEventListener("click", () => {
  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];

  if (!file) return;

  if (!file.type.startsWith("video/")) {
    alert("Please select a video.");
    return;
  }

  alert("Uploading video...");

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "Stains_videos");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/xfmqkihq/video/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log(data);
      alert("Upload failed.");
      return;
    }

    await addDoc(collection(db, "videos"), {
      uid: currentUser.uid,
      publicId: data.public_id,
      url: data.secure_url,
      createdAt: serverTimestamp()
    });

    console.log("Video uploaded:", data.secure_url);

    alert("Video uploaded successfully! 🎉");

  } catch (error) {
    console.log(error);
    alert("Something went wrong.");
  }
});