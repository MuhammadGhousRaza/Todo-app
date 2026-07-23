import { supabaseClient } from "./supabaseClient.js";

const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");
const logoutBtn = document.querySelector("#logoutBtn");
const userEmailLabel = document.querySelector("#userEmail");
const toastRoot = document.querySelector("#toast");

const redirectTo = (target) => {
  window.location.href = target;
};

const showToast = (message, type = "success") => {
  if (!toastRoot) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastRoot.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));

  setTimeout(() => {
    toast.classList.remove("visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 4000);
};

const toggleButton = (button, isLoading) => {
  if (!button) return;
  button.disabled = isLoading;
  button.classList.toggle("btn-loading", isLoading);
  const loader = button.querySelector(".loader");
  if (loader) {
    loader.classList.toggle("hidden", !isLoading);
  }
};

const validateEmail = (email) => {
  return typeof email === "string" && email.trim().length > 0 && /^\S+@\S+\.\S+$/.test(email);
};

const validatePassword = (password) => {
  return typeof password === "string" && password.trim().length >= 6;
};

const getCurrentSession = async () => {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    console.error("Auth session check failed", error);
    return null;
  }
  return data.session;
};

const redirectIfAuthenticated = async () => {
  const session = await getCurrentSession();
  if (session) {
    redirectTo("index.html");
  }
};

const protectDashboard = async () => {
  const session = await getCurrentSession();
  if (!session) {
    redirectTo("login.html");
    return false;
  }

  if (userEmailLabel) {
    userEmailLabel.textContent = session.user.email || "User";
  }

  return true;
};

const loginUser = async (event) => {
  event.preventDefault();
  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;
  const button = document.querySelector("#loginBtn");

  if (!validateEmail(email)) {
    showToast("Enter a valid email address.", "error");
    return;
  }

  if (!validatePassword(password)) {
    showToast("Password must be at least 6 characters.", "error");
    return;
  }

  toggleButton(button, true);

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim()
  });

  toggleButton(button, false);

  if (error) {
    showToast(error.message || "Unable to sign in.", "error");
    return;
  }

  showToast("Welcome back! Redirecting to your dashboard.");
  redirectTo("index.html");
};

const signupUser = async (event) => {
  event.preventDefault();
  const email = document.querySelector("#signupEmail").value;
  const password = document.querySelector("#signupPassword").value;
  const button = document.querySelector("#signupBtn");

  if (!validateEmail(email)) {
    showToast("Enter a valid email address.", "error");
    return;
  }

  if (!validatePassword(password)) {
    showToast("Password must be at least 6 characters.", "error");
    return;
  }

  toggleButton(button, true);

  const { data, error } = await supabaseClient.auth.signUp({
    email: email.trim(),
    password: password.trim()
  });

  toggleButton(button, false);

  if (error) {
    showToast(error.message || "Unable to create account.", "error");
    return;
  }

  showToast("Account created successfully. Check your email for verification.");
  redirectTo("index.html");
};

const logoutUser = async () => {
  if (!logoutBtn) return;
  toggleButton(logoutBtn, true);
  const { error } = await supabaseClient.auth.signOut();
  toggleButton(logoutBtn, false);

  if (error) {
    showToast(error.message || "Unable to sign out.", "error");
    return;
  }

  showToast("You have been logged out.");
  redirectTo("login.html");
};

if (loginForm) {
  redirectIfAuthenticated();
  loginForm.addEventListener("submit", loginUser);
}

if (signupForm) {
  redirectIfAuthenticated();
  signupForm.addEventListener("submit", signupUser);
}

if (logoutBtn) {
  protectDashboard();
  logoutBtn.addEventListener("click", logoutUser);
}

if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  protectDashboard();
}
