export default function Navbar() {
  return `
        <aside class="sidebar" id="main-sidebar">
            <div class="sidebar-header">
                <span>📚 LMS Pro</span>
            </div>
            <nav style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
                <a href="#dashboard" class="nav-link">Dashboard</a>
                <a href="#books" class="nav-link">Books Inventory</a>
                <a href="#issue" class="nav-link">Issue / Return</a>
            </nav>
            
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 10px;">
                 <button id="theme-toggle" class="btn btn-outline" style="width: 100%; color: var(--text-on-dark); border-color: rgba(255,255,255,0.2);">
                    🌙 Theme
                 </button>
                 <button onclick="window.handleLogout()" class="btn btn-danger" style="width: 100%;">
                    Log Out
                 </button>
            </div>
        </aside>
    `;
}
