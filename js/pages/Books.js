import Store from "../core/Store.js";
import Auth from "../core/Auth.js";

export default function Books() {
  const user = Auth.getUser();
  const isAdmin = user && user.role === "admin";
  const currentSearch = window.currentSearchTerm || "";
  const books = Store.getBooks(currentSearch);

  // --- CONDITIONAL UI PARTS ---

  // 1. Top Section: Admin gets Add Form, Student gets nothing (or maybe instructions)
  let topSection = "";
  if (isAdmin) {
    topSection = `
            <div class="card" style="margin-bottom: 2rem; border-left: 4px solid var(--primary);">
                <h3 style="margin-bottom: 1rem;" id="formTitle">Add New Book</h3>
                <form id="bookForm" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
                    <input type="hidden" id="b_id">
                    <div class="input-group"><input type="text" id="b_title" placeholder="Title" required /></div>
                    <div class="input-group"><input type="text" id="b_author" placeholder="Author" required /></div>
                    <div class="input-group"><input type="text" id="b_isbn" placeholder="ISBN" required /></div>
                    <div style="display: flex; gap: 10px;">
                        <button type="submit" class="btn btn-primary" id="formBtn">+ Add</button>
                        <button type="button" class="btn btn-outline" id="cancelBtn" style="display: none;" onclick="window.resetForm()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
  }

  // 2. Table Rows Generation
  const rows = books
    .map((book) => {
      let actionButtons = "";
      let statusBadge = "";

      // Status Logic
      if (book.status === "Available")
        statusBadge = `<span style="color: var(--success); background: rgba(16, 185, 129, 0.1); padding: 2px 6px; border-radius: 4px;">Available</span>`;
      else if (book.status === "Requested")
        statusBadge = `<span style="color: orange; background: rgba(255, 165, 0, 0.1); padding: 2px 6px; border-radius: 4px;">Requested</span>`;
      else
        statusBadge = `<span style="color: var(--danger); background: rgba(239, 68, 68, 0.1); padding: 2px 6px; border-radius: 4px;">Issued</span>`;

      // Button Logic
      if (isAdmin) {
        actionButtons = `
                <button onclick="window.loadEdit(${book.id})" class="btn btn-outline" style="padding: 0.3rem;">Edit</button>
                <button onclick="window.handleDelete(${book.id})" style="color: var(--danger); background: none; border: none; cursor: pointer;">Delete</button>
            `;
      } else {
        // Student Actions
        if (book.status === "Available") {
          actionButtons = `<button onclick="window.handleRequest(${book.id})" class="btn btn-primary" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">Request</button>`;
        } else if (
          book.status === "Requested" &&
          book.requestedBy === user.username
        ) {
          actionButtons = `<span style="color: orange; font-size: 0.8rem;">Pending Approval...</span>`;
        } else if (book.status === "Issued" && book.holder === user.username) {
          actionButtons = `<span style="color: var(--success); font-size: 0.8rem;">Owned</span>`;
        } else {
          actionButtons = `<span style="color: var(--text-muted); font-size: 0.8rem;">Unavailable</span>`;
        }
      }

      return `
            <tr>
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${statusBadge}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
    })
    .join("");

  return `
        <div class="fade-in">
            <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h1>${isAdmin ? "Manage Books" : "Library Search"}</h1>
                <input type="text" id="searchInput" placeholder="Search books..." value="${currentSearch}" style="padding: 0.5rem; width: 250px;">
            </header>
            ${topSection}
            <div class="table-container">
                <table>
                    <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}
