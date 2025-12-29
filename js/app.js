import Store from "./core/Store.js";
import Router from "./core/Router.js";
import Auth from "./core/Auth.js";
import Navbar from "./components/Navbar.js";

// Pages
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Books from "./pages/Books.js";
import BookDetail from "./pages/BookDetail.js";
import IssueReturn from "./pages/IssueReturn.js";
import Users from "./pages/Users.js";
import StudentInventory from "./pages/StudentInventory.js";
import Settings from "./pages/Settings.js";
import Complaints from "./pages/Complaints.js";

Store.init();

const app = document.getElementById("app");

// Theme Applicator
const applyTheme = () => {
  const theme = Store.getState().theme;
  if (theme === "dark") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
};

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
  applyTheme();
};

const routes = {
  login: Login,
  dashboard: Dashboard,
  books: Books,
  "book-detail": BookDetail,
  issue: IssueReturn,
  users: Users,
  mybooks: StudentInventory,
  settings: Settings,
  complaints: Complaints,
};

window.addEventListener("hashchange", renderLayout);
renderLayout();
const router = new Router(routes);

// --- GLOBAL EVENT LISTENERS ---

// 1. Navigation & View Book
window.viewBook = (id) => {
  window.currentBookId = id;
  window.location.hash = "book-detail";
};

// 2. Issue Logic (With Date Picker)
window.initIssue = (bookId) => {
  const settings = Store.getSettings();
  const user = Auth.getUser();

  // Calculate max date for the placeholder
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + parseInt(settings.maxBorrowDays));
  const maxDateStr = maxDate.toISOString().split("T")[0];
  const todayStr = new Date().toISOString().split("T")[0];

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

window.processReturn = (txId) => {
  if (confirm("Confirm return?")) {
    const fine = Store.returnBook(txId);
    if (fine > 0) alert(`Book Returned. FINE CHARGED: $${fine}`);
    else alert("Book Returned.");
    router.handleRoute();
  }
};

// 3. Social Features (Reviews, Likes, Complaints)
document.body.addEventListener("submit", (e) => {
  e.preventDefault();

  // Review Form
  if (e.target.id === "reviewForm") {
    const rating = document.getElementById("r_rating").value;
    const comment = document.getElementById("r_comment").value;
    const user = Auth.getUser();
    if (window.currentBookId) {
      Store.addReview(window.currentBookId, user.username, rating, comment);
      router.handleRoute(); // Refresh to show review
    }
  }

  // Complaint Form
  if (e.target.id === "complaintForm") {
    const text = document.getElementById("c_text").value;
    const user = Auth.getUser();
    Store.addComplaint(user.username, text);
    alert("Complaint Submitted");
    e.target.reset();
  }

  // Settings Form
  if (e.target.id === "settingsForm") {
    const fine = document.getElementById("s_fine").value;
    const days = document.getElementById("s_days").value;
    Store.updateSettings({ finePerDay: fine, maxBorrowDays: days });
    alert("Settings Saved!");
  }

  // Book Form (Admin)
  if (e.target.id === "bookForm") {
    const data = {
      id: document.getElementById("b_id").value,
      title: document.getElementById("b_title").value,
      author: document.getElementById("b_author").value,
      isbn: document.getElementById("b_isbn").value,
      category: document.getElementById("b_category").value,
      totalStock: document.getElementById("b_stock").value,
      description: document.getElementById("b_desc").value,
    };
    Store.addBook(data); // Simplified for this example
    router.handleRoute();
  }

  // Login Form
  if (e.target.id === "loginForm") {
    const u = document.getElementById("login_user").value;
    const p = document.getElementById("login_pass").value;
    const r = document.querySelector('input[name="role"]:checked').value;
    if (Auth.login(u, p, r)) window.location.hash = "dashboard";
    else alert("Invalid Credentials");
  }
});

window.handleLike = (id, type) => {
  Store.toggleLike(id, type);
  router.handleRoute();
};

window.handleLogout = () => Auth.logout();

// Theme Toggle
document.body.addEventListener("click", (e) => {
  if (e.target.id === "theme-toggle") {
    Store.toggleTheme();
    applyTheme();
  }
});

// Search
document.body.addEventListener("input", (e) => {
  if (e.target.id === "searchInput") {
    window.currentSearchTerm = e.target.value;
    router.handleRoute();
    setTimeout(() => document.getElementById("searchInput")?.focus(), 0);
  }
});
