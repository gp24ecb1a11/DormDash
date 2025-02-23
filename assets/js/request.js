import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase setup
const firebaseConfig = {
    apiKey: "AIzaSyAeOS8_0tDWKnfAwLf0GRKr6JaopYj1nnY",
    authDomain: "dormdash-40a10.firebaseapp.com",
    projectId: "dormdash-40a10",
    storageBucket: "dormdash-40a10.appspot.com",
    messagingSenderId: "219135353050",
    appId: "1:219135353050:web:49446a2e74414ebf8105e3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);  // ✅ Declare auth globally

// Wait for DOM to load before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById("orderForm");
    
    if (!orderForm) {
        console.error("Error: orderForm not found. Check if the form ID is correct.");
        return;
    }

    orderForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const user = auth.currentUser;  // ✅ Now auth is accessible
        if (!user) {
            alert("You must be logged in to place an order.");
            return;
        }

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const reward = document.getElementById("reward").value;

        try {
            await addDoc(collection(db, "requests"), {
                title: title,
                description: description,
                reward: reward,
                createdBy: user.email,  // ✅ Now the order will store createdBy in Firestore
                acceptedBy: null,
                acceptedEmail: null
            });

            alert("Order placed successfully!");
            window.location.href = "available_requests.html";
        } catch (error) {
            console.error("Error adding order:", error);
        }
    });
});
