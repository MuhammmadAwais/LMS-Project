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

const routes = {
  login: Login,
  dashboard: Dashboard,
  books: Books,
  issue: IssueReturn,
  users: Users,
  mybooks: StudentInventory,
};

window.addEventListener("hashchange", renderLayout);
renderLayout();
const router = new Router(routes);

// --- GLOBAL LOGIC ---

// 1. FILTERS & SEARCH
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

// 2. ADMIN: ADD/EDIT BOOK
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

  // Book Form
  if (e.target.id === "bookForm") {
    e.preventDefault();
    const data = {
      id: document.getElementById("b_id").value,
      title: document.getElementById("b_title").value,
      author: document.getElementById("b_author").value,
      isbn: document.getElementById("b_isbn").value,
      category: document.getElementById("b_category").value,
      totalStock: document.getElementById("b_stock").value,
    };

    if (data.id) Store.updateBook(data);
    else Store.addBook(data);

    window.resetForm();
    router.handleRoute();
  }
});

// 3. ADMIN: ISSUE / RETURN LOGIC
window.manualIssue = () => {
  // Simple prompt-based UI for now. Can be a Modal later.
  const username = prompt("Enter Student Username:");
  const bookId = prompt("Enter Book ID (See Inventory):"); // In real app, use a select dropdown
  const days = prompt("Days to return:", "7");

  if (username && bookId) {
    const res = Store.issueBook(bookId, username, days);
    if (res === "SUCCESS") {
      alert("Book Issued Successfully");
      router.handleRoute();
    } else {
      alert("Error: " + res);
    }
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

// 4. STUDENT REQUEST (Simplified to auto-issue for demo, or request logic)
window.handleRequest = (bookId, title) => {
  if (confirm(`Request to borrow "${title}"?`)) {
    // For this demo, we'll treat a request as an immediate issue for 7 days
    // In a strict system, this would go to a "Pending" list first
    const user = Auth.getUser();
    const res = Store.issueBook(bookId, user.username, 7);
    if (res === "SUCCESS")
      alert("Book has been issued to you! Check 'My Inventory'.");
    else alert("Failed: " + res);
    router.handleRoute();
  }
};

// 5. HELPER: LOAD EDIT FORM
window.loadEdit = (id) => {
  const book = Store.getState().books.find((b) => b.id == id);
  if (book) {
    document.getElementById("b_id").value = book.id;
    document.getElementById("b_title").value = book.title;
    document.getElementById("b_author").value = book.author;
    document.getElementById("b_isbn").value = book.isbn;
    document.getElementById("b_category").value = book.category || "Fiction";
    document.getElementById("b_stock").value = book.totalStock;

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

window.handleDelete = (id) => {
  if (confirm("Delete?")) {
    Store.deleteBook(id);
    router.handleRoute();
  }
};
window.handleLogout = () => Auth.logout();
