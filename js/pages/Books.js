import Store from "../core/Store.js";
import Auth from "../core/Auth.js";

export default function Books() {
  const user = Auth.getUser();
  const isAdmin = user && user.role === "admin";
  const currentSearch = window.currentSearchTerm || "";
  const books = Store.getBooks(currentSearch);

  let adminForm = "";
  if (isAdmin) {
    adminForm = `
        <div class="card" style="margin-bottom: 2rem; border-left: 4px solid var(--primary);">
            <h3 style="margin-bottom: 1rem;">Add New Book</h3>
            <form id="bookForm" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; align-items: end;">
                <input type="hidden" id="b_id">
                
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Title</label>
                    <input type="text" id="b_title" class="form-input" placeholder="Book Title" required />
                </div>
                
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Author</label>
                    <input type="text" id="b_author" class="form-input" placeholder="Author Name" required />
                </div>
                
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Category</label>
                    <input type="text" id="b_category" class="form-input" placeholder="Genre" required />
                </div>
                
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Stock</label>
                    <input type="number" id="b_stock" class="form-input" value="1" required />
                </div>
                
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">ISBN</label>
                    <input type="text" id="b_isbn" class="form-input" placeholder="ISBN-13" required />
                </div>
                
                <div class="form-group" style="grid-column: 1 / -1; margin-bottom: 0;">
                    <label class="form-label">Description</label>
                    <input type="text" id="b_desc" class="form-input" placeholder="Brief description..." />
                </div>
                
                <div style="grid-column: 1 / -1; display: flex; gap: 10px;">
                    <button type="submit" id="formBtn" class="btn btn-primary"><i class='bx bx-plus'></i> Add Book</button>
                    <button type="button" id="cancelBtn" onclick="window.resetForm()" class="btn btn-outline" style="display: none;">Cancel</button>
                </div>
            </form>
        </div>
    `;
  }

  const rows = books
    .map(
      (book) => `
        <tr style="cursor: pointer; transition: background 0.2s;" onclick="window.viewBook(${
          book.id
        })">
            <td>
                <div style="font-weight: 600; color: var(--text-main); font-size: 1rem;">${
                  book.title
                }</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px;">
                    <i class='bx bx-category'></i> ${book.category}
                </div>
            </td>
            <td>${book.author}</td>
            <td>
                <span class="badge ${
                  book.availableStock > 0 ? "badge-success" : "badge-danger"
                }">
                    ${book.availableStock} / ${book.totalStock}
                </span>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <i class='bx bxs-like' style="color: var(--primary);"></i> ${
                      book.likes || 0
                    }
                </div>
            </td>
        </tr>
    `
    )
    .join("");

  return `
        <div class="fade-in">
            <header class="page-header">
                <h1 class="page-title">Library Inventory</h1>
                <p class="page-subtitle">Browse and manage the collection</p>
            </header>

            <div style="margin-bottom: 2rem;">
                <div class="input-wrapper" style="max-width: 400px;">
                    <i class='bx bx-search'></i>
                    <input type="text" id="searchInput" class="form-input" placeholder="Search by title or author..." value="${currentSearch}">
                </div>
            </div>

            ${adminForm}

            <div class="card table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Book Details</th>
                            <th>Author</th>
                            <th>Availability</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${
                          rows.length
                            ? rows
                            : '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No books found matching your search.</td></tr>'
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
