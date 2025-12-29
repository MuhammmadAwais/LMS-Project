import Store from "./core/Store.js";
import Router from "./core/Router.js";
import Auth from "./core/Auth.js";
import Navbar from "./components/Navbar.js";

// Pages
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Books from "./pages/Books.js";
import IssueReturn from "./pages/IssueReturn.js"; // Admin
import Users from "./pages/Users.js"; // Admin
import StudentInventory from "./pages/StudentInventory.js"; // Student

Store.init();

// --- LAYOUT ---
const app = document.getElementById("app");

const renderLayout = () => {
  if (window.location.hash === "#login" || window.location.hash === "") {
    app.innerHTML = `<main id="page-content" style="background: var(--bg-body); min-height: 100vh; padding: 2rem; display: flex; justify-content: center;"></main>`;
  } else {
    app.innerHTML = `
            <div class="app-container">
                ${Navbar()}
                <main id="page-content" class="main-content"></main>
            </div>
        `;
  }
};

// --- ROUTES ---
const routes = {
  login: Login,
  dashboard: Dashboard,
  books: Books,
  issue: IssueReturn,
  users: Users,
  mybooks: StudentInventory,
};

// Handle route changes
window.addEventListener("hashchange", renderLayout);
renderLayout();

const router = new Router(routes);

// --- GLOBAL HANDLERS ---

// 1. AUTH / SIGNUP UI LOGIC
window.switchAuthTab = (tab) => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginTab = document.getElementById("tab-login");
  const signupTab = document.getElementById("tab-signup");
  const msg = document.getElementById("signup-msg");

  msg.style.display = "none";

  if (tab === "login") {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    loginTab.style.borderBottomColor = "var(--primary)";
    loginTab.style.color = "var(--text-main)";
    signupTab.style.borderBottomColor = "transparent";
    signupTab.style.color = "var(--text-muted)";
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    signupTab.style.borderBottomColor = "var(--primary)";
    signupTab.style.color = "var(--text-main)";
    loginTab.style.borderBottomColor = "transparent";
    loginTab.style.color = "var(--text-muted)";
  }
};

document.body.addEventListener("submit", (e) => {
  e.preventDefault();

  // LOGIN
  if (e.target.id === "loginForm") {
    const user = document.getElementById("login_user").value;
    const pass = document.getElementById("login_pass").value;
    const role = document.querySelector('input[name="role"]:checked').value;

    if (Auth.login(user, pass, role)) {
      window.location.hash = "dashboard";
    } else {
      const msg = document.getElementById("login-msg");
      msg.innerText = "Invalid credentials or Role!";
      msg.style.display = "block";
    }
  }

  // SIGNUP
  if (e.target.id === "signupForm") {
    const user = document.getElementById("sign_user").value;
    const pass = document.getElementById("sign_pass").value;

    if (Store.signup(user, pass)) {
      const msg = document.getElementById("signup-msg");
      msg.innerText = "Account created! Please Login.";
      msg.style.display = "block";
      e.target.reset();
      setTimeout(() => window.switchAuthTab("login"), 1500);
    } else {
      alert("Username already exists!");
    }
  }

  // ADD BOOK (Admin)
  if (e.target.id === "bookForm") {
    const id = document.getElementById("b_id").value;
    const title = document.getElementById("b_title").value;
    const author = document.getElementById("b_author").value;
    const isbn = document.getElementById("b_isbn").value;

    if (id) Store.updateBook({ id, title, author, isbn });
    else Store.addBook({ title, author, isbn });

    window.resetForm();
    router.handleRoute();
  }
});

// 2. STUDENT ACTIONS
window.handleRequest = (bookId) => {
  const user = Auth.getUser();
  if (!user) return;

  const result = Store.requestBook(bookId, user.username);
  if (result === "BANNED") alert("You are banned from borrowing books.");
  else if (result === "UNAVAILABLE") alert("Book is no longer available.");
  else {
    alert("Request sent to Admin!");
    router.handleRoute();
  }
};

window.returnMyBook = (bookId) => {
  if (confirm("Return this book to library?")) {
    Store.returnBook(bookId);
    router.handleRoute();
  }
};

// 3. ADMIN ACTIONS
window.approveRequest = (bookId) => {
  Store.approveRequest(bookId);
  router.handleRoute();
};

window.rejectRequest = (bookId) => {
  Store.rejectRequest(bookId);
  router.handleRoute();
};

window.handleReturn = (bookId) => {
  if (confirm("Confirm return/revoke of this book?")) {
    Store.returnBook(bookId);
    router.handleRoute();
  }
};

window.toggleBan = (username) => {
  if (confirm(`Toggle ban status for ${username}?`)) {
    Store.toggleBan(username);
    router.handleRoute();
  }
};

window.handleDelete = (id) => {
  if (confirm("Delete this book?")) {
    Store.deleteBook(id);
    router.handleRoute();
  }
};

window.handleLogout = () => Auth.logout();

// Helpers
window.resetForm = () => {
  document.getElementById("bookForm").reset();
  document.getElementById("b_id").value = "";
  document.getElementById("formTitle").innerText = "Add New Book";
  document.getElementById("formBtn").innerText = "+ Add";
  document.getElementById("cancelBtn").style.display = "none";
};

// Edit Helper
window.loadEdit = (id) => {
  const book = Store.getState().books.find((b) => b.id == id);
  if (book) {
    document.getElementById("b_id").value = book.id;
    document.getElementById("b_title").value = book.title;
    document.getElementById("b_author").value = book.author;
    document.getElementById("b_isbn").value = book.isbn;
    document.getElementById("formTitle").innerText = "Edit Book";
    document.getElementById("formBtn").innerText = "Save";
    document.getElementById("cancelBtn").style.display = "inline-block";
  }
};

// Search
document.body.addEventListener("input", (e) => {
  if (e.target.id === "searchInput") {
    window.currentSearchTerm = e.target.value;
    router.handleRoute();
    setTimeout(() => document.getElementById("searchInput")?.focus(), 0);
  }
});
