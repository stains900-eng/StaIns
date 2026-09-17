import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBZhmn4Kfl4WWM5MMD_qwynSfxaFxtLEA8",
  authDomain: "fishbool.firebaseapp.com",
  projectId: "fishbool",
  storageBucket: "fishbool.firebasestorage.app",
  messagingSenderId: "843704831923",
  appId: "1:843704831923:web:10d42fabfd339a6c54c5c6",
  measurementId: "G-MBW1M3SZNX"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const pfp = document.getElementById("pfp");
const stn = document.getElementById("stn");

const myPosts = document.getElementById("myPosts");
const myVideos = document.getElementById("myVideos");


onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const params =
    new URLSearchParams(window.location.search);

  const searchedUid =
    params.get("uid");

  const uidToShow =
    searchedUid || user.uid;


  await loadProfile(uidToShow);
  await loadMyPosts(uidToShow);
  await loadMyVideos(uidToShow);

});


async function loadProfile(uid) {

  try {

    const userRef = doc(
      db,
      "users_" + uid,
      "profile"
    );

    const userSnap =
      await getDoc(userRef);


    if (!userSnap.exists()) {

      stn.textContent = "User";
      pfp.src = "default-profile.png";

      return;
    }


    const data =
      userSnap.data();


    const fullName = [
      data.firstname,
      data.middlename,
      data.surname
    ]
      .filter(Boolean)
      .join(" ");


    stn.textContent =
      fullName || "User";


    if (data.photoURL) {

      pfp.src =
        data.photoURL;

    } else {

      pfp.src =
        "default-profile.png";

    }


  } catch (error) {

    console.error(
      "Profile error:",
      error
    );

    stn.textContent =
      "User";

    pfp.src =
      "default-profile.png";

  }

}


async function loadMyPosts(uid) {

  myPosts.innerHTML =
    "<h2>My Posts</h2>";


  try {

    const q = query(
      collection(db, "posts"),
      where("uid", "==", uid)
    );


    const snapshot =
      await getDocs(q);


    if (snapshot.empty) {

      myPosts.innerHTML +=
        "<p>No posts yet.</p>";

      return;
    }


    snapshot.forEach((post) => {

      const data =
        post.data();


      const div =
        document.createElement("div");


      div.className =
        "profile-post";


      div.innerHTML = `
        <p>${data.text || ""}</p>
      `;


      myPosts.appendChild(div);

    });


  } catch (error) {

    console.error(
      "Posts error:",
      error
    );

  }

}


async function loadMyVideos(uid) {

  myVideos.innerHTML =
    "<h2>My Videos</h2>";


  try {

    const q = query(
      collection(db, "videos"),
      where("uid", "==", uid)
    );


    const snapshot =
      await getDocs(q);


    if (snapshot.empty) {

      myVideos.innerHTML +=
        "<p>No videos yet.</p>";

      return;
    }


    snapshot.forEach((video) => {

      const data =
        video.data();


      const div =
        document.createElement("div");


      div.className =
        "profile-video";


      div.innerHTML = `
        <video
          src="${data.url}"
          controls
          playsinline
          width="100%">
        </video>
      `;


      myVideos.appendChild(div);

    });


  } catch (error) {

    console.error(
      "Videos error:",
      error
    );

  }

}