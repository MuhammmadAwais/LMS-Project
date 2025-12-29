import Auth from "../core/Auth.js";

export default function Navbar() {
  const user = Auth.getUser();
  const isAdmin = user && user.role === "admin";
  const currentHash = window.location.hash || "#dashboard";

  // Helper to generate nav links with icons
  const createLink = (hash, iconClass, label) => {
    const isActive =
      currentHash === hash ||
      (hash !== "#dashboard" && currentHash.startsWith(hash));
    return `
      <a href="${hash}" class="nav-link ${isActive ? "active" : ""}">
        <i class='${iconClass}'></i>
        <span>${label}</span>
      </a>
    `;
  };

  let navLinksHtml = "";
  if (isAdmin) {
    navLinksHtml = `
      ${createLink("#dashboard", "bx bxs-dashboard", "Dashboard")}
      ${createLink("#books", "bx bxs-book", "Manage Books")}
      ${createLink("#issue", "bx bx-transfer-alt", "Circulation")}
      ${createLink("#users", "bx bxs-user-detail", "Students")}
    `;
  } else {
    navLinksHtml = `
      ${createLink("#dashboard", "bx bxs-dashboard", "Dashboard")}
      ${createLink("#books", "bx bx-search-alt", "Browse Library")}
      ${createLink("#mybooks", "bx bxs-bookmarks", "My Books")}
    `;
  }

  return `
    <aside class="sidebar fade-in-left">
      <div class="sidebar-header">
        <i class='bx bxs-book-reader' style="font-size: 2rem; color: var(--primary);"></i>
        <span class="brand">Athena</span>
      </div>
      
      <div class="user-profile-mini">
        <div class="avatar">
          ${user ? user.username.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <div style="font-weight: 700; font-size: 1.1rem;">${
            user ? user.username : "Guest"
          }</div>
          <div style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">${
            isAdmin ? "Administrator" : "Student Member"
          }</div>
        </div>
      </div>

      <nav class="nav-menu">
        ${navLinksHtml}
      </nav>
      
      <div class="sidebar-footer">
        <button id="theme-toggle" class="btn btn-outline" style="width: 100%; color: var(--text-on-dark); border-color: rgba(255,255,255,0.2);">
          <i class='bx bx-moon'></i> <span>Toggle Theme</span>
        </button>
        <button id="logout-btn" class="btn btn-danger" style="width: 100%;">
          <i class='bx bx-log-out-circle'></i> <span>Log Out</span>
        </button>
      </div>
    </aside>
  `;
}
