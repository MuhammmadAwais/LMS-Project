import Store from "./core/Store.js";
import Router from "./core/Router.js";
import Auth from "./core/Auth.js";
import Navbar from "./components/Navbar.js";

import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Books from "./pages/Books.js";
import IssueReturn from "./pages/IssueReturn.js";
import Users from "./pages/Users.js";
import StudentInventory from "./pages/StudentInventory.js";
import BookDetail from "./pages/BookDetail.js";
import Settings from "./pages/Settings.js";
import Complaints from "./pages/Complaints.js";

// Initialize Data Store
Store.init();

const app = document.getElementById("app");

// --- THEME & LAYOUT LOGIC ---

const applyTheme = () => {
  const theme = Store.getState().theme || "light";
  if (theme === "dark") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
};

const renderLayout = () => {
  // If we are on login page or root with no hash, show full screen content
  if (window.location.hash === "#login" || window.location.hash === "") {
    app.innerHTML = `<main id="page-content" style="background: var(--bg-body); min-height: 100vh;"></main>`;
  } else {
    // Otherwise show the Admin/Student Dashboard Layout (Sidebar + Content)
    app.innerHTML = `
            <div class="app-container">
                ${Navbar()}
                <main id="page-content" class="main-content"></main>
            </div>
        `;
  }
  applyTheme();
};

const routes = {
  login: Login,
  dashboard: Dashboard,
  books: Books,
  issue: IssueReturn,
  users: Users,
  mybooks: StudentInventory,
  "book-detail": BookDetail,
  settings: Settings,
  complaints: Complaints,
};

window.addEventListener("hashchange", renderLayout);
// Initial render
renderLayout();

// Initialize Router (This handles injecting the page content into #page-content)
const router = new Router(routes);

// --- GLOBAL EVENT LISTENERS (BUSINESS LOGIC) ---

window.viewBook = (id) => {
  window.currentBookId = id;
  window.location.hash = "book-detail";
};

window.handleCategory = (val) => {
  window.currentCategory = val;
  router.handleRoute();
};

document.body.addEventListener("input", (e) => {
  if (e.target.id === "searchInput") {
    window.currentSearchTerm = e.target.value;
    router.handleRoute();
    setTimeout(() => document.getElementById("searchInput")?.focus(), 0);
  }
});

document.body.addEventListener("submit", (e) => {
  // Login
  if (e.target.id === "loginForm") {
    e.preventDefault();
    const u = document.getElementById("login_user").value;
    const p = document.getElementById("login_pass").value;
    const roleElem = document.querySelector('input[name="role"]:checked');
    const r = roleElem ? roleElem.value : "student";

    if (Auth.login(u, p, r)) window.location.hash = "dashboard";
    else alert("Invalid Login Credentials");
  }

  // Signup
  if (e.target.id === "signupForm") {
    e.preventDefault();
    const user = document.getElementById("sign_user").value;
    const pass = document.getElementById("sign_pass").value;

    if (Store.signup(user, pass)) {
      const msg = document.getElementById("signup-msg");
      if (msg) {
        msg.innerText = "Account created! Please Login.";
        msg.style.display = "block";
      }
      e.target.reset();
      alert("Account Created Successfully! Switching to Login...");
      setTimeout(() => window.switchAuthTab("login"), 1000);
    } else {
      alert("Username already exists!");
    }
  }

  // Book Add/Edit Form
  if (e.target.id === "bookForm") {
    e.preventDefault();
    const data = {
      id: document.getElementById("b_id").value,
      title: document.getElementById("b_title").value,
      author: document.getElementById("b_author").value,
      isbn: document.getElementById("b_isbn").value,
      category: document.getElementById("b_category").value,
      totalStock: document.getElementById("b_stock").value,
      description: document.getElementById("b_desc")?.value || "",
    };

    if (data.id) Store.updateBook(data);
    else Store.addBook(data);

    window.resetForm();
    router.handleRoute();
  }

  // Settings Form
  if (e.target.id === "settingsForm") {
    e.preventDefault();
    const fine = document.getElementById("s_fine").value;
    const days = document.getElementById("s_days").value;
    Store.updateSettings({ finePerDay: fine, maxBorrowDays: days });
    alert("Settings Saved!");
  }

  // Complaint Form
  if (e.target.id === "complaintForm") {
    e.preventDefault();
    const text = document.getElementById("c_text").value;
    const user = Auth.getUser();
    Store.addComplaint(user.username, text);
    alert("Complaint Submitted");
    e.target.reset();
    router.handleRoute();
  }

  // Review Form
  if (e.target.id === "reviewForm") {
    e.preventDefault();
    const rating = document.getElementById("r_rating").value;
    const comment = document.getElementById("r_comment").value;
    const user = Auth.getUser();
    if (window.currentBookId) {
      Store.addReview(window.currentBookId, user.username, rating, comment);
      router.handleRoute();
    }
  }
});

// Auth Switcher Helper
window.switchAuthTab = (tab) => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const msg = document.getElementById("signup-msg");

  if (msg) msg.style.display = "none";

  if (tab === "login") {
    if (loginForm) loginForm.style.display = "block";
    if (signupForm) signupForm.style.display = "none";
    if (tabLogin) tabLogin.classList.add("active");
    if (tabSignup) tabSignup.classList.remove("active");
  } else {
    if (loginForm) loginForm.style.display = "none";
    if (signupForm) signupForm.style.display = "block";
    if (tabLogin) tabLogin.classList.remove("active");
    if (tabSignup) tabSignup.classList.add("active");
  }
};

window.initIssue = (bookId) => {
  const settings = Store.getSettings();
  const user = Auth.getUser();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + parseInt(settings.maxBorrowDays));
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const dateStr = prompt(
    `Enter Return Date (YYYY-MM-DD)\nMax allowed: ${maxDateStr}`,
    maxDateStr
  );

  if (dateStr) {
    const res = Store.issueBook(bookId, user.username, dateStr);
    if (res === "SUCCESS") {
      alert("Book Issued Successfully!");
      router.handleRoute();
    } else {
      alert("Failed: " + res);
    }
  }
};

window.openReply = (id) => {
  const reply = prompt("Enter Reply for this complaint:");
  if (reply) {
    Store.replyToComplaint(id, reply);
    router.handleRoute();
  }
};

window.handleDeleteComplaint = (id) => {
  if (confirm("Are you sure you want to delete this complaint?")) {
    Store.deleteComplaint(id);
    router.handleRoute();
  }
};

window.deleteReview = (bookId, reviewId) => {
  if (confirm("Delete this review?")) {
    Store.deleteReview(bookId, reviewId);
    router.handleRoute();
  }
};

window.processReturn = (txId) => {
  if (confirm("Process return for this book?")) {
    const fine = Store.returnBook(txId);
    if (fine > 0) alert(`Book Returned. LATE FINE COLLECTED: $${fine}`);
    else alert("Book Returned on time.");
    router.handleRoute();
  }
};

window.studentReturn = (txId) => {
  if (confirm("Do you want to return this book now?")) {
    const fine = Store.returnBook(txId);
    if (fine > 0) alert(`Book Returned. You had a fine of $${fine}`);
    else alert("Book Returned Successfully.");
    router.handleRoute();
  }
};

window.loadEdit = (id) => {
  const book = Store.getBookById(id);
  if (book) {
    document.getElementById("b_id").value = book.id;
    document.getElementById("b_title").value = book.title;
    document.getElementById("b_author").value = book.author;
    document.getElementById("b_isbn").value = book.isbn;
    document.getElementById("b_category").value = book.category || "Fiction";
    document.getElementById("b_stock").value = book.totalStock;
    if (document.getElementById("b_desc"))
      document.getElementById("b_desc").value = book.description || "";

    const btn = document.getElementById("formBtn");
    if (btn) btn.innerHTML = "<i class='bx bx-save'></i> Save Changes";

    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) cancelBtn.style.display = "inline-flex";

    window.scrollTo(0, 0);
  }
};

window.resetForm = () => {
  const form = document.getElementById("bookForm");
  if (form) form.reset();
  document.getElementById("b_id").value = "";

  const btn = document.getElementById("formBtn");
  if (btn) btn.innerHTML = "<i class='bx bx-plus'></i> Add Book";

  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) cancelBtn.style.display = "none";
};

window.handleLike = (id, type) => {
  const user = Auth.getUser();
  if (user) {
    Store.toggleLike(id, user.username, type);
    router.handleRoute();
  } else {
    alert("Please login to like/dislike.");
  }
};

window.handleDelete = (id) => {
  if (confirm("Delete?")) {
    Store.deleteBook(id);
    router.handleRoute();
  }
};

window.toggleBan = (username) => {
  if (confirm(`Are you sure you want to change ban status for ${username}?`)) {
    Store.toggleBan(username);
    router.handleRoute();
  }
};

window.handleLogout = () => Auth.logout();

document.body.addEventListener("click", (e) => {
  // Check if the clicked element or its parent is the theme toggle
  if (e.target.id === "theme-toggle" || e.target.closest("#theme-toggle")) {
    Store.toggleTheme();
    applyTheme();
  }
});
