import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  sendPasswordResetEmail
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

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

const button = document.getElementById("btn2");

button.onclick = function() {

  const email = document.getElementById("email1").value.trim();

  if (email1 === "") {
    alert("Please enter your email.");
    return;
  }

  sendPasswordResetEmail(auth, email)

    .then(function() {
      alert("Password reset email sent! Check your email inbox or spam.");
    })

    .catch(function(error) {
  console.log(error);
  alert(error.code + "\n" + error.message);
});
  
};