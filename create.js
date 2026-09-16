let ct = document.getElementById("ct");
let ctt = document.getElementById("ctt");

ctt.onclick = function() {
    if (ct.type === "password") {
        ct.type = "text";
        ctt.innerHTML = "🙈";
    } else {
        ct.type = "password";
        ctt.innerHTML = "🙉";
    }
};

let ct2 = document.getElementById("ct2");
let ctt2 = document.getElementById("ctt2");

ctt2.onclick = function() {
    if (ct2.type === "password") {
        ct2.type = "text";
        ctt2.innerHTML = "🙈";
    } else {
        ct2.type = "password";
        ctt2.innerHTML = "🙉";
    }
};


import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


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

const button = document.getElementById("btn3");


button.addEventListener("click", function () {

  const firstname =
    document.getElementById("firstname").value.trim();

  const middlename =
    document.getElementById("middlename").value.trim();

  const surname =
    document.getElementById("surname").value.trim();

  const password =
    document.getElementById("ct").value;

  const confirmPassword =
    document.getElementById("ct2").value;

  const email =
    document.getElementById("email").value.trim();

  const mobile =
    document.getElementById("mobile").value.trim();


  if (
    firstname === "" ||
    middlename === "" ||
    surname === "" ||
    password === "" ||
    confirmPassword === "" ||
    email === "" ||
    mobile === ""
  ) {
    alert("Please complete all fields.");
    return;
  }


  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }


  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }


  createUserWithEmailAndPassword(auth, email, password)

    .then(async function (userCredential) {

      const user = userCredential.user;
      const uid = user.uid;

      // Send verification email
      await sendEmailVerification(user);

      // Save user information
      await setDoc(doc(db, "users", uid), {

        firstname: firstname,
        middlename: middlename,
        surname: surname,
        email: email,
        mobile: mobile

      });

    })

    .then(function () {

      alert(
        "Account created! 📧 Please check your email spam or inbox and verify your account before logging in."
      );

      window.location.href = "index.html";

    })

    .catch(function (error) {

      console.log(error);
      alert(error.message);

    });

});
