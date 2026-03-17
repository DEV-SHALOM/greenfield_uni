const HASHED_USERNAME = "f9bc2b8faf09d32e2600eded378adaa0a13351af3057c54c4a4442d9c2478583";
const HASHED_PASSWORD = "35e2af5fd8123992ad4068ac8c5e03414243ffbdc4fc8d51a3752862e88b3f30";

async function hashValue(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Toggle password visibility (global for inline onclick)
function togglePassword() {
  const input = document.getElementById("password");
  const eyeOpen = document.getElementById("eye-open");
  const eyeClosed = document.getElementById("eye-closed");

  if (input.type === "password") {
    input.type = "text";
    eyeOpen.classList.add("hidden");
    eyeClosed.classList.remove("hidden");
  } else {
    input.type = "password";
    eyeOpen.classList.remove("hidden");
    eyeClosed.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loginPage = document.getElementById("login-page");
  const mainPage = document.getElementById("main-page");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");
  const logoutBtn = document.getElementById("logout-btn");

  function showMainPage() {
    loginPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
    if (typeof window.initMainPage === "function") {
      window.initMainPage();
    }
  }

  function showLoginPage() {
    mainPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    usernameInput.value = "";
    passwordInput.value = "";
    errorMessage.classList.add("hidden");
    usernameInput.focus();
  }

  // Check if user is already logged in
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    showMainPage();
  }

  // Login form submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const hashedUsername = await hashValue(username);
    const hashedPassword = await hashValue(password);

    if (hashedUsername === HASHED_USERNAME && hashedPassword === HASHED_PASSWORD) {
      sessionStorage.setItem("isLoggedIn", "true");
      showMainPage();
      errorMessage.classList.add("hidden");
    } else {
      errorMessage.classList.remove("hidden");
      usernameInput.value = "";
      passwordInput.value = "";
      usernameInput.focus();
    }
  });

  // Logout
  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("isLoggedIn");
    showLoginPage();
  });
});