import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


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
const videoContainer = document.getElementById("videoContainer");

let currentUser = null;



onAuthStateChanged(auth, user => {

  currentUser = user;

  loadVideos();

});



const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.accept = "video/*";
fileInput.style.display = "none";

document.body.appendChild(fileInput);



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


    await addDoc(
      collection(db, "videos"),
      {
        uid: currentUser.uid,
        publicId: data.public_id,
        url: data.secure_url,
        createdAt: serverTimestamp()
      }
    );

    await addDoc(collection(db, "notifications"), {
  uid: currentUser.uid,
  title: "New Video",
  message: "Your video was uploaded successfully! 🎉",
  createdAt: Date.now()
});


    alert("Video uploaded successfully! 🎉");

    loadVideos();


  } catch (error) {

    console.log(error);
    alert("Something went wrong.");

  }

});



async function getUserProfile(uid) {

  try {

    const userDoc = await getDoc(
      doc(db, "users", uid)
    );

    if (userDoc.exists()) {
      return userDoc.data();
    }

  } catch (error) {

    console.log("Profile error:", error);

  }

  return null;

}



async function loadVideos() {

  videoContainer.innerHTML =
    "<p style='color:white;text-align:center;'>Loading...</p>";


  try {

    const snapshot = await getDocs(
      collection(db, "videos")
    );


    videoContainer.innerHTML = "";


    if (snapshot.empty) {

      videoContainer.innerHTML =
        "<p style='color:white;text-align:center;'>No videos yet.</p>";

      return;

    }


    for (const videoDoc of snapshot.docs) {

      const data = videoDoc.data();


      const videoBox =
        document.createElement("div");

      videoBox.className = "videoBox";


      const video =
        document.createElement("video");

      video.src = data.url;

      video.controls = true;

      video.autoplay = true;

      video.loop = true;

      video.playsInline = true;

      video.preload = "auto";



      const userArea =
        document.createElement("div");

      userArea.className = "videoUser";


      const profileImage =
        document.createElement("img");

      profileImage.className =
        "videoProfile";


      const userName =
        document.createElement("span");

      userName.className =
        "videoUsername";


      const profile =
        await getUserProfile(data.uid);


      if (profile) {

        const first =
          profile.firstname || "";

        const middle =
          profile.middlename || "";

        const surname =
          profile.surname || "";


        const fullName =
          `${first} ${middle} ${surname}`
          .replace(/\s+/g, " ")
          .trim();


        userName.textContent =
          fullName || "StaIns User";


        if (profile.photoURL) {

          profileImage.src =
            profile.photoURL;

        } else {

          profileImage.src =
            "default-profile.png";

        }

      } else {

        userName.textContent =
          "StaIns User";

        profileImage.src =
          "default-profile.png";

      }


      userArea.appendChild(profileImage);
      userArea.appendChild(userName);


      if (
        currentUser &&
        currentUser.uid === data.uid
      ) {

        const deleteButton =
          document.createElement("button");

        deleteButton.textContent =
          "Delete";

        deleteButton.className =
          "deleteVideo";


        deleteButton.addEventListener(
          "click",
          async () => {

            const confirmDelete =
              confirm("Delete this video?");


            if (!confirmDelete) return;


            try {

              await deleteDoc(
                doc(
                  db,
                  "videos",
                  videoDoc.id
                )
              );


              videoBox.remove();


            } catch (error) {

              console.log(error);

              alert(
                "Failed to delete video."
              );

            }

          }
        );


        videoBox.appendChild(
          deleteButton
        );

      }


      videoBox.appendChild(video);
      videoBox.appendChild(userArea);

      videoContainer.appendChild(videoBox);

    }


    enableAutoPlay();


  } catch (error) {

    console.log(error);

    videoContainer.innerHTML =
      "<p style='color:white;text-align:center;'>Failed to load videos.</p>";

  }

}


function enableAutoPlay() {

  const videos =
    document.querySelectorAll(
      "#videoContainer video"
    );


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          const video = entry.target;


          if (entry.isIntersecting) {

            video.play().catch(error => {

              console.log(
                "Autoplay with sound was blocked:",
                error
              );

            });

          } else {

            video.pause();

          }

        });

      },
      {
        threshold: 0.7
      }
    );


  videos.forEach(video => {

    observer.observe(video);

  });

}