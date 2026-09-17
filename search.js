import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getFirestore,
  collection,
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
const db = getFirestore(app);


const searchInput =
  document.getElementById("searchInput");

const results =
  document.getElementById("results");


searchInput.addEventListener("input", async () => {

  const searchText =
    searchInput.value.trim().toLowerCase();

  results.innerHTML = "";

  if (!searchText) {
    return;
  }


  try {

    const snapshot = await getDocs(
      collection(db, "userSearch")
    );


    let found = false;


    snapshot.forEach((userDoc) => {

      const data = userDoc.data();


      const fullName = [
        data.firstname,
        data.middlename,
        data.surname
      ]
        .filter(Boolean)
        .join(" ");


      if (
        fullName
          .toLowerCase()
          .includes(searchText)
      ) {

        found = true;


        const userDiv =
          document.createElement("div");

        userDiv.className =
          "search-user";


        const img =
          document.createElement("img");

        img.src =
          data.photoURL ||
          "default-profile.png";

        img.alt =
          "Profile Picture";


        const name =
          document.createElement("strong");

        name.textContent =
          fullName;


        userDiv.appendChild(img);

        userDiv.appendChild(name);


        userDiv.addEventListener("click", () => {

          window.location.href =
            "profile.html?uid=" +
            encodeURIComponent(data.uid);

        });


        results.appendChild(userDiv);

      }

    });


    if (!found) {

      results.innerHTML =
        "<p>No users found.</p>";

    }


  } catch (error) {

    console.error(
      "Search error:",
      error
    );


    results.innerHTML =
      "<p>Failed to search users.</p>";

  }

});