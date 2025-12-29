import Auth from "../core/Auth.js";

export default function Navbar() {
  const user = Auth.getUser();
  const isAdmin = user && user.role === "admin";

  let navLinks = "";

  if (isAdmin) {
    navLinks = `
            <a href="#dashboard" class="nav-link">Dashboard</a>
            <a href="#books" class="nav-link">Manage Books</a>
            <a href="#issue" class="nav-link">Circulation</a>
            <a href="#users" class="nav-link">Users</a>
            <a href="#complaints" class="nav-link">Complaints</a>
            <a href="#settings" class="nav-link">⚙️ Settings</a>
        `;
  } else {
    navLinks = `
            <a href="#dashboard" class="nav-link">Dashboard</a>
            <a href="#books" class="nav-link">Library Search</a>
            <a href="#mybooks" class="nav-link">My Inventory</a>
            <a href="#complaints" class="nav-link">Support</a>
        `;
  }

  return `
        <aside class="sidebar" id="main-sidebar">
            <div class="sidebar-header">
                <span>📚 LMS ${isAdmin ? "Admin" : "Student"}</span>
            </div>
            
            <div style="padding: 0 0 1rem 0; color: var(--text-muted); font-size: 0.9rem;">
                Logged in as: <strong style="color: var(--primary);">${
                  user ? user.username : "Guest"
                }</strong>
            </div>

            <nav style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
                ${navLinks}
            </nav>
            
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 10px;">
                 <button id="theme-toggle" class="btn btn-outline" style="width: 100%;">
                    🌙 Theme
                 </button>
                 <button onclick="window.handleLogout()" class="btn btn-danger" style="width: 100%;">
                    Log Out
                 </button>
            </div>
        </aside>
    `;
}
