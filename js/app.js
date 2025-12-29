import Store from "./core/Store.js";
import Router from "./core/Router.js";
import Auth from "./core/Auth.js";
import Navbar from "./components/Navbar.js";

// Page Imports
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Books from "./pages/Books.js";
import IssueReturn from "./pages/IssueReturn.js";
import Users from "./pages/Users.js";
import StudentInventory from "./pages/StudentInventory.js";
import BookDetail from "./pages/BookDetail.js"; // Was missing
import Settings from "./pages/Settings.js"; // Was missing
import Complaints from "./pages/Complaints.js"; // Was missing

Store.init();

const app = document.getElementById("app");

// Fix Theme Logic
const applyTheme = () => {
  const theme = Store.getState().theme || "light";
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
  applyTheme(); // Ensure theme is applied on render
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
renderLayout();
const router = new Router(routes);

// --- GLOBAL EVENT LISTENERS ---

// 1. Navigation Helper
window.viewBook = (id) => {
  window.currentBookId = id;
  window.location.hash = "book-detail";
};

// 2. FILTERS & SEARCH
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

// 3. FORM SUBMISSIONS (Login, Books, Settings, Reviews, Complaints)
document.body.addEventListener("submit", (e) => {
  // Login
  if (e.target.id === "loginForm") {
    e.preventDefault();
    const u = document.getElementById("login_user").value;
    const p = document.getElementById("login_pass").value;
    const r = document.querySelector('input[name="role"]:checked').value;
    if (Auth.login(u, p, r)) window.location.hash = "dashboard";
    else alert("Invalid Login");
  }

  // Book Form (Add/Edit)
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

// 4. ISSUE / RETURN / REPLY LOGIC
window.initIssue = (bookId) => {
  const settings = Store.getSettings();
  const user = Auth.getUser();

  // Calculate max date
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

window.processReturn = (txId) => {
  if (confirm("Process return for this book?")) {
    const fine = Store.returnBook(txId);
    if (fine > 0) alert(`Book Returned. LATE FINE COLLECTED: $${fine}`);
    else alert("Book Returned on time.");
    router.handleRoute();
  }
};

// 5. HELPER: LOAD EDIT FORM
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

    document.getElementById("formBtn").innerText = "Save";
    document.getElementById("cancelBtn").style.display = "inline";
    window.scrollTo(0, 0);
  }
};

window.resetForm = () => {
  document.getElementById("bookForm").reset();
  document.getElementById("b_id").value = "";
  document.getElementById("formBtn").innerText = "+ Add";
  document.getElementById("cancelBtn").style.display = "none";
};

window.handleLike = (id, type) => {
  Store.toggleLike(id, type);
  router.handleRoute();
};

window.handleDelete = (id) => {
  if (confirm("Delete?")) {
    Store.deleteBook(id);
    router.handleRoute();
  }
};

window.handleLogout = () => Auth.logout();

// Theme Toggle
document.body.addEventListener("click", (e) => {
  if (e.target.id === "theme-toggle") {
    Store.toggleTheme();
    applyTheme();
  }
});
