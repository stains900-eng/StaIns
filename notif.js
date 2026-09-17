import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
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

const notifications =
  document.getElementById("notifications");

onAuthStateChanged(auth, user => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadNotifications(user.uid);

});

async function loadNotifications(uid) {

  notifications.innerHTML =
    "<p>Loading...</p>";

  try {

    const q = query(
      collection(db, "notifications"),
      where("uid", "==", uid)
    );

    const snapshot =
      await getDocs(q);

    const notificationList =
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    notificationList.sort((a, b) => {

      const aTime =
        a.createdAt?.toMillis?.() || 0;

      const bTime =
        b.createdAt?.toMillis?.() || 0;

      return bTime - aTime;

    });

    notifications.innerHTML = "";

    if (notificationList.length === 0) {

      notifications.innerHTML =
        "<p>No notifications yet.</p>";

      return;
    }

    notificationList.forEach(data => {

      const div =
        document.createElement("div");

      div.className =
        "notification";

      div.innerHTML = `
        <strong>${data.title || "Notification"}</strong>
        <p>${data.message || ""}</p>
      `;

      notifications.appendChild(div);

    });

  } catch (error) {

    console.error("Notification error:", error);

    notifications.innerHTML =
      "<p>Failed to load notifications.</p>";

  }

}