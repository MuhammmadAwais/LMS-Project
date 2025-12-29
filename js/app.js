import Store from "./core/Store.js";
import Router from "./core/Router.js";
import Auth from "./core/Auth.js";
import Navbar from "./components/Navbar.js";

// Pages
import Dashboard from "./pages/Dashboard.js";
import Books from "./pages/Books.js";
import IssueReturn from "./pages/IssueReturn.js";
import Login from "./pages/Login.js";

Store.init();

// --- LAYOUT MANAGEMENT ---
const app = document.getElementById("app");

const renderLayout = () => {
  // If on login page, don't show sidebar
  const isLogin = window.location.hash === "#login";

  if (isLogin) {
    app.innerHTML = `<main id="page-content" style="background: var(--bg-body); height: 100vh; overflow-y: auto; padding: 2rem; display: flex; justify-content: center;"></main>`;
  } else {
    app.innerHTML = `
            <div class="app-container">
                ${Navbar()}
                <main id="page-content" class="main-content"></main>
            </div>
        `;
  }
};

// --- ROUTER SETUP ---
const routes = {
  dashboard: Dashboard,
  books: Books,
  issue: IssueReturn,
  login: Login,
};

// Re-render layout when hash changes (to toggle sidebar on/off for login)
window.addEventListener("hashchange", renderLayout);
renderLayout(); // Initial call

const router = new Router(routes);

// --- GLOBAL EVENT HANDLERS ---

// 1. AUTHENTICATION
document.body.addEventListener("submit", (e) => {
  if (e.target.id === "loginForm") {
    e.preventDefault();
    const user = document.getElementById("login_user").value;
    const pass = document.getElementById("login_pass").value;

    if (Auth.login(user, pass)) {
      window.location.hash = "dashboard";
    } else {
      document.getElementById("login-error").style.display = "block";
    }
  }
});

window.handleLogout = () => {
  Auth.logout();
};

// 2. BOOKS CRUD
// Handle Add/Update Form
document.body.addEventListener("submit", (e) => {
  if (e.target.id === "bookForm") {
    e.preventDefault();
    const id = document.getElementById("b_id").value;
    const title = document.getElementById("b_title").value;
    const author = document.getElementById("b_author").value;
    const isbn = document.getElementById("b_isbn").value;

    if (id) {
      // Update Mode
      Store.updateBook({ id, title, author, isbn });
    } else {
      // Add Mode
      Store.addBook({ title, author, isbn });
    }
    window.resetForm();
    router.handleRoute();
  }
});

// Delete Book
window.handleDelete = (id) => {
  if (confirm("Are you sure?")) {
    Store.deleteBook(id);
    router.handleRoute();
  }
};

// 3. EDIT BOOK HELPER
// This function fills the form with existing data
window.loadEdit = (id) => {
  const book = Store.getBookById(id);
  if (book) {
    document.getElementById("b_id").value = book.id;
    document.getElementById("b_title").value = book.title;
    document.getElementById("b_author").value = book.author;
    document.getElementById("b_isbn").value = book.isbn;

    // UI Changes
    document.getElementById("formTitle").innerText = "Edit Book";
    document.getElementById("formBtn").innerText = "Save Changes";
    document.getElementById("formBtn").classList.remove("btn-primary");
    document.getElementById("formBtn").classList.add("btn-success");
    document.getElementById("cancelBtn").style.display = "inline-block";

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

window.resetForm = () => {
  document.getElementById("bookForm").reset();
  document.getElementById("b_id").value = "";
  document.getElementById("formTitle").innerText = "Add New Book";
  document.getElementById("formBtn").innerText = "+ Add Book";
  document.getElementById("formBtn").classList.add("btn-primary");
  document.getElementById("formBtn").classList.remove("btn-success");
  document.getElementById("cancelBtn").style.display = "none";
};

// 4. SEARCH FUNCTIONALITY
document.body.addEventListener("input", (e) => {
  if (e.target.id === "searchInput") {
    window.currentSearchTerm = e.target.value;
    // Re-render just the table part would be better, but re-routing is easier for now
    // To prevent focus loss, we simple update the innerHTML of the container
    const books = Store.getBooks(e.target.value);

    // We need to import BookTable here or ensure it's available.
    // Since app.js imports modules, we can't easily use the imported function inside this scope dynamically
    // unless we attach it to window or re-trigger route.
    // Simplest "SPA" way without React:
    router.handleRoute();

    // Restore focus
    setTimeout(() => {
      const input = document.getElementById("searchInput");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  }
});

// 5. ISSUE / RETURN LOGIC
window.openIssueModal = (id, title) => {
  const student = prompt(`Issue "${title}" to whom? (Enter Student Name)`);
  if (student) {
    Store.issueBook(id, student);
    router.handleRoute();
  }
};

window.handleReturn = (id) => {
  if (confirm("Confirm return of this book?")) {
    Store.returnBook(id);
    router.handleRoute();
  }
};

// 6. THEME
document.body.addEventListener("click", (e) => {
  if (e.target.id === "theme-toggle") {
    const newTheme = Store.toggleTheme();
    if (newTheme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }
});

// Apply theme on load
if (Store.getState().theme === "dark") document.body.classList.add("dark");
