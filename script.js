let password = document.getElementById("password");
let show = document.getElementById("show");

show.onclick = function() {
    if (password.type === "password") {
        password.type = "text";
        show.innerHTML = "🙈";
    } else {
        password.type = "password";
        show.innerHTML = "🙉";
    }
};


import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
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


const loginButton = document.getElementById("btn");


loginButton.onclick = function() {

  const email = document.getElementById("name").value.trim();
  const passwordValue = document.getElementById("password").value;

  if (email === "" || passwordValue === "") {
    alert("Please enter your email and password.");
    return;
  }


  signInWithEmailAndPassword(auth, email, passwordValue)

    .then(async function(userCredential) {

      const user = userCredential.user;

      if (!user.emailVerified) {

        await signOut(auth);

        alert(
          "Please verify your email first. 📧\n\n" +
          "Check your Gmail inbox or Spam folder."
        );

        return;
      }


      alert("Login successful! 🎉");

      window.location.href = "home.html";

    })

    .catch(function(error) {

      console.log(error);

      alert("Incorrect email or password.");

    });

};