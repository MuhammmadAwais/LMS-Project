import Store from "../core/Store.js";
import Auth from "../core/Auth.js";

export default function StudentInventory() {
  const user = Auth.getUser();
  const books = Store.getBooks().filter((b) => b.holder === user.username);

  const rows = books
    .map(
      (b) => `
        <tr>
            <td>${b.title}</td>
            <td>${b.author}</td>
            <td>${b.isbn}</td>
            <td><button class="btn btn-outline" onclick="window.returnMyBook(${b.id})">Return Book</button></td>
        </tr>
    `
    )
    .join("");

  return `
        <div class="fade-in">
            <h1>My Inventory</h1>
            <div class="card" style="margin-top: 1rem;">
                ${
                  books.length
                    ? `
                    <table>
                        <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Action</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                `
                    : "<p>You have no books issued.</p>"
                }
            </div>
        </div>
    `;
}
