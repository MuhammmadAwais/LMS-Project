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
                <h3>Add New Book</h3>
                <form id="bookForm" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: end;">
                    <input type="hidden" id="b_id">
                    <div class="input-group"><label>Title</label><input type="text" id="b_title" required /></div>
                    <div class="input-group"><label>Author</label><input type="text" id="b_author" required /></div>
                    <div class="input-group"><label>Category</label><input type="text" id="b_category" required /></div>
                    <div class="input-group"><label>Stock</label><input type="number" id="b_stock" value="1" required /></div>
                    <div class="input-group"><label>ISBN</label><input type="text" id="b_isbn" required /></div>
                    <div class="input-group" style="grid-column: 1 / -1;"><label>Description</label><input type="text" id="b_desc" placeholder="Brief description..." /></div>
                    <button type="submit" class="btn btn-primary">+ Add Book</button>
                </form>
            </div>
        `;
  }

  const rows = books
    .map(
      (book) => `
        <tr style="cursor: pointer;" onclick="window.viewBook(${book.id})">
            <td>
                <strong style="color:var(--primary);">${book.title}</strong>
                <div style="font-size:0.8rem; color:var(--text-muted);">${
                  book.category
                }</div>
            </td>
            <td>${book.author}</td>
            <td>${book.availableStock} / ${book.totalStock}</td>
            <td>${book.likes || 0} 👍</td>
        </tr>
    `
    )
    .join("");

  return `
        <div class="fade-in">
            <h1>Library Inventory</h1>
            <div style="display:flex; justify-content:space-between; margin: 1rem 0;">
                <input type="text" id="searchInput" placeholder="Search title or author..." value="${currentSearch}" style="padding:0.5rem; width:100%; max-width:400px;">
            </div>
            ${adminForm}
            <div class="card table-container">
                <table>
                    <thead><tr><th>Book</th><th>Author</th><th>Stock</th><th>Likes</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}
