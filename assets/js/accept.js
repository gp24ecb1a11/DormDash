import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAeOS8_0tDWKnfAwLf0GRKr6JaopYj1nnY",
    authDomain: "dormdash-40a10.firebaseapp.com",
    projectId: "dormdash-40a10",
    storageBucket: "dormdash-40a10.firebasestorage.app",
    messagingSenderId: "219135353050",
    appId: "1:219135353050:web:49446a2e74414ebf8105e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");
const title = params.get("title");
const description = params.get("description");
const reward = params.get("reward");

// Display order details
document.getElementById("orderTitle").textContent = title;
document.getElementById("orderDescription").textContent = description;
document.getElementById("orderReward").textContent = `Reward: ₹${reward}`;

let userEmail = null;

// Ensure user is logged in before allowing order acceptance
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html"; // Redirect if not logged in
    } else {
        userEmail = user.email;
    }
});

// Confirm Order Button
document.getElementById("confirmOrder").addEventListener("click", async function () {
    if (!userEmail) return;

    const userName = prompt("Enter your name to confirm the order:");
    if (!userName) return alert("Order confirmation requires your name.");

    const confirmAccept = confirm("Do you want to confirm this order?");
    if (!confirmAccept) return;

    // Update Firestore
    await updateDoc(doc(db, "requests", orderId), {
        taken: true,
        acceptedBy: userEmail,
        acceptedEmail: userName
    });

    alert("Order Confirmed!");
    window.location.href = "available_requests.html"; // Redirect back
});