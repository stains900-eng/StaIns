import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

const upl = document.getElementById("upl");
const posts = document.getElementById("posts");

let currentUser = null;

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  loadPosts();
});

async function getUserProfile(uid) {
  try {
    const userDoc = await getDoc(
      doc(db, "users_" + uid, "profile")
    );

    if (userDoc.exists()) {
      return userDoc.data();
    }
  } catch (error) {
    console.error("Profile error:", error);
  }

  return null;
}

upl.addEventListener("click", async () => {
  const text = prompt("Write your post:");

  if (!text || text.trim() === "") {
    return;
  }

  try {
    await addDoc(
      collection(db, "posts"),
      {
        uid: currentUser.uid,
        text: text.trim(),
        createdAt: Date.now()
      }
    );

    await addDoc(collection(db, "notifications"), {
      uid: currentUser.uid,
      title: "New Post",
      message: "Your post was uploaded successfully! 🎉",
      createdAt: Date.now()
    });

    loadPosts();

  } catch (error) {
    console.error(error);
    alert("Failed to create post.");
  }
});

async function loadPosts() {
  posts.innerHTML = "";

  try {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    for (const postDoc of snapshot.docs) {
      const post = postDoc.data();

      const profile =
        await getUserProfile(post.uid);

      let fullName = "StaIns User";
      let photoURL = "default-profile.png";

      if (profile) {
        const first =
          profile.firstname || "";

        const middle =
          profile.middlename || "";

        const surname =
          profile.surname || "";

        fullName =
          `${first} ${middle} ${surname}`
          .replace(/\s+/g, " ")
          .trim();

        if (profile.photoURL) {
          photoURL = profile.photoURL;
        }
      }

      const div =
        document.createElement("div");

      div.className = "post";

      div.innerHTML = `
        <div class="post-user">
          <img
            src="${photoURL}"
            width="40"
            height="40"
            class="post-profile"
          >

          <strong>
            ${fullName || "StaIns User"}
          </strong>
        </div>

        <p>${post.text}</p>

        ${
          post.uid === currentUser.uid
            ? `<button class="delete-post">
                 Delete
               </button>`
            : ""
        }
      `;

      posts.appendChild(div);

      const deleteButton =
        div.querySelector(".delete-post");

      if (deleteButton) {
        deleteButton.addEventListener(
          "click",
          async () => {

            const confirmDelete =
              confirm("Delete this post?");

            if (!confirmDelete) {
              return;
            }

            try {
              await deleteDoc(
                doc(
                  db,
                  "posts",
                  postDoc.id
                )
              );

              loadPosts();

            } catch (error) {
              console.error(error);

              alert(
                "Failed to delete post."
              );
            }
          }
        );
      }
    }

  } catch (error) {
    console.error(error);
    alert("Failed to load posts.");
  }
}