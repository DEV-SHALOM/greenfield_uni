const HASHED_USERNAME = "d2e1280695b239dbce713414159bafe4f4868a790aee802d9146677ddafcf4c2";
const HASHED_PASSWORD = "ece4e662f6d220b1e795fb3bfd504620f384b8abe4b5fac564f6e59731cef763";

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