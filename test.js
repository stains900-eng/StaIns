import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBZhmn4Kfl4WWM5MMD_qwynSfxaFxtLEA8/",
  authDomain: "fishbool.firebaseapp.com",
  projectId: "fishbool",
  storageBucket: "fishbool.firebasestorage.app",
  messagingSenderId: "843704831923",
  appId: "1:843704831923:web:10d42fabfd339a6c54c5c6"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


onAuthStateChanged(auth, async (user) => {

  if (!user) {
    console.log("❌ WALANG NAKA-LOGIN");
    return;
  }

  console.log("✅ USER LOGGED IN");
  console.log("UID:", user.uid);
  console.log("EMAIL:", user.email);


  try {

    console.log("⏳ Sinusubukan ang setDoc()...");

    await setDoc(
      doc(db, "users", user.uid),
      {
        firstname: "TEST",
        middlename: "USER",
        surname: "FIREBASE",
        email: user.email,
        mobile: "0000000000",
        photoURL: ""
      }
    );

    console.log("✅ SETDOC SUCCESS!");
    alert("SUCCESS! Na-save ang user sa Firestore.");

  } catch (error) {

    console.error("❌ SETDOC FAILED");
    console.error("ERROR CODE:", error.code);
    console.error("ERROR MESSAGE:", error.message);

    alert(
      "SETDOC FAILED!\n\n" +
      "Code: " + error.code + "\n\n" +
      "Message: " + error.message
    );
  }

});