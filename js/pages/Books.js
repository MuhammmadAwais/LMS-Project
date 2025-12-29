import Store from "../core/Store.js";
import Auth from "../core/Auth.js";

export default function Books() {
  const user = Auth.getUser();
  const isAdmin = user && user.role === "admin";
  const currentSearch = window.currentSearchTerm || "";
  const currentCategory = window.currentCategory || "All";

  const books = Store.getBooks(currentSearch, currentCategory);

  // --- ADMIN FORM (Now with Category & Stock) ---
  let topSection = "";
  if (isAdmin) {
    topSection = `
            <div class="card" style="margin-bottom: 2rem; border-left: 4px solid var(--primary);">
                <h3 style="margin-bottom: 1rem;" id="formTitle">Add New Book</h3>
                <form id="bookForm" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: end;">
                    <input type="hidden" id="b_id">
                    <div class="input-group">
                        <label>Title</label>
                        <input type="text" id="b_title" required />
                    </div>
                    <div class="input-group">
                        <label>Author</label>
                        <input type="text" id="b_author" required />
                    </div>
                    <div class="input-group">
                        <label>Category</label>
                        <select id="b_category">
                            <option>Programming</option>
                            <option>Fiction</option>
                            <option>Science</option>
                            <option>History</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Stock Qty</label>
                        <input type="number" id="b_stock" min="1" value="1" required />
                    </div>
                    <div class="input-group">
                        <label>ISBN</label>
                        <input type="text" id="b_isbn" required />
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button type="submit" class="btn btn-primary" id="formBtn">+ Add</button>
                        <button type="button" class="btn btn-outline" id="cancelBtn" style="display: none;" onclick="window.resetForm()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
  }

  const rows = books
    .map((book) => {
      // Stock Badge Logic
      const stockBadge =
        book.availableStock > 0
          ? `<span style="color:var(--success); font-weight:bold;">${book.availableStock} / ${book.totalStock}</span>`
          : `<span style="color:var(--danger); font-weight:bold;">Out of Stock</span>`;

      let action = "";
      if (isAdmin) {
        action = `<button onclick="window.loadEdit(${book.id})" class="btn btn-outline">Edit</button> 
                      <button onclick="window.handleDelete(${book.id})" style="color:red; background:none; border:none; cursor:pointer;">Del</button>`;
      } else {
        // Student: Request Button (Only if stock > 0)
        if (book.availableStock > 0) {
          action = `<button onclick="window.handleRequest('${book.id}', '${book.title}')" class="btn btn-primary">Request</button>`;
        } else {
          action = `<button disabled class="btn btn-outline" style="opacity:0.5; cursor:not-allowed;">Unavailable</button>`;
        }
      }

      return `
            <tr>
                <td><strong>${book.title}</strong><br><small style="color:var(--text-muted)">${book.category}</small></td>
                <td>${book.author}</td>
                <td>${stockBadge}</td>
                <td>${action}</td>
            </tr>
        `;
    })
    .join("");

  return `
        <div class="fade-in">
            <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap:wrap; gap:1rem;">
                <h1>${isAdmin ? "Manage Inventory" : "Library Search"}</h1>
                
                <div style="display:flex; gap:10px;">
                    <select id="categoryFilter" onchange="window.handleCategory(this.value)" style="padding:0.5rem; border-radius:6px; border:1px solid var(--border);">
                        <option value="All" ${
                          currentCategory === "All" ? "selected" : ""
                        }>All Categories</option>
                        <option value="Programming" ${
                          currentCategory === "Programming" ? "selected" : ""
                        }>Programming</option>
                        <option value="Fiction" ${
                          currentCategory === "Fiction" ? "selected" : ""
                        }>Fiction</option>
                        <option value="Science" ${
                          currentCategory === "Science" ? "selected" : ""
                        }>Science</option>
                    </select>
                    <input type="text" id="searchInput" placeholder="Search..." value="${currentSearch}" style="padding: 0.5rem; width: 200px;">
                </div>
            </header>
            ${topSection}
            <div class="card table-container">
                <table>
                    <thead><tr><th>Book Details</th><th>Author</th><th>Stock Availability</th><th>Actions</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}
