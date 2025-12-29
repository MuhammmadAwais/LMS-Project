export default function BookTable(books) {
  if (!books.length)
    return '<p style="padding: 1rem; color: var(--text-muted);">No books found.</p>';

  const rows = books
    .map(
      (book) => `
        <tr>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>
                <span style="
                    padding: 0.25rem 0.5rem; 
                    border-radius: 4px; 
                    font-size: 0.8rem;
                    background: ${
                      book.status === "Available"
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(239, 68, 68, 0.1)"
                    };
                    color: ${
                      book.status === "Available"
                        ? "var(--success)"
                        : "var(--danger)"
                    };
                ">
                    ${book.status}
                </span>
            </td>
            <td>
                <button onclick="window.loadEdit(${
                  book.id
                })" class="btn btn-outline" style="padding: 0.3rem 0.6rem; margin-right: 5px;">Edit</button>
                <button onclick="window.handleDelete(${
                  book.id
                })" style="color: var(--danger); background: none; border: none; cursor: pointer;">Delete</button>
            </td>
        </tr>
    `
    )
    .join("");

  return `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}
