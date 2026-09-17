import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


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


const ct = document.getElementById("ct");
const ctt = document.getElementById("ctt");

const ct2 = document.getElementById("ct2");
const ctt2 = document.getElementById("ctt2");

const button = document.getElementById("btn3");

const edit = document.getElementById("edit");
const picInput = document.getElementById("picInput");
const pfps = document.getElementById("pfps");

let selectedPhoto = null;


edit.addEventListener("click", () => {
  picInput.click();
});


picInput.addEventListener("change", () => {

  const file = picInput.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image for your profile picture.");
    return;
  }

  selectedPhoto = file;

  pfps.src = URL.createObjectURL(file);

});


ctt.onclick = function() {

  if (ct.type === "password") {
    ct.type = "text";
    ctt.innerHTML = "🙈";
  } else {
    ct.type = "password";
    ctt.innerHTML = "🙉";
  }

};


ctt2.onclick = function() {

  if (ct2.type === "password") {
    ct2.type = "text";
    ctt2.innerHTML = "🙈";
  } else {
    ct2.type = "password";
    ctt2.innerHTML = "🙉";
  }

};


button.onclick = async function() {

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

    alert(
      "Please complete all fields before creating your account."
    );

    return;
  }


  if (!selectedPhoto) {

    alert(
      "Please choose a profile picture before creating your account. 📸"
    );

    return;
  }


  if (password !== confirmPassword) {

    alert("Passwords do not match!");

    return;
  }


  if (password.length < 6) {

    alert(
      "Password must be at least 6 characters."
    );

    return;
  }


  try {

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    const user = userCredential.user;


    let photoURL = "";


    alert("Uploading profile picture... 📸");


    const formData = new FormData();

    formData.append(
      "file",
      selectedPhoto
    );

    formData.append(
      "upload_preset",
      "Stains_images"
    );


    const response = await fetch(
      "https://api.cloudinary.com/v1_1/xfmqkihq/image/upload",
      {
        method: "POST",
        body: formData
      }
    );


    const photoData =
      await response.json();


    if (!response.ok) {

      throw new Error(
        photoData.error?.message ||
        "Profile picture upload failed."
      );

    }


    photoURL =
      photoData.secure_url;


    const userRef = doc(
      db,
      "users_" + user.uid,
      "profile"
    );


    await setDoc(userRef, {

      uid: user.uid,

      firstname: firstname,

      middlename: middlename,

      surname: surname,

      email: email,

      mobile: mobile,

      photoURL: photoURL

    });

    const searchRef = doc(
  db,
  "userSearch",
  user.uid
);

await setDoc(searchRef, {
  uid: user.uid,
  firstname: firstname,
  middlename: middlename,
  surname: surname,
  photoURL: photoURL
});


    await sendEmailVerification(user);


    alert(
      "Account created successfully! 📧\n\n" +
      "Please check your email inbox or spam folder " +
      "and verify your account before logging in."
    );


    window.location.href =
      "index.html";


  } catch (error) {

    console.error(
      "ERROR CODE:",
      error.code
    );

    console.error(
      "ERROR MESSAGE:",
      error.message
    );


    alert(
      "Account creation failed:\n\n" +
      error.code +
      "\n\n" +
      error.message
    );

  }

};