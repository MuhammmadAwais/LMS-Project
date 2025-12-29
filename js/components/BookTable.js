export default function BookTable(books) {
  if (!books.length)
    return '<p style="padding: 2rem; color: var(--text-muted); text-align: center;">No books available to display.</p>';

  const rows = books
    .map(
      (book) => `
        <tr>
            <td>
                <div style="font-weight: 600;">${book.title}</div>
            </td>
            <td>${book.author}</td>
            <td><span style="font-family: monospace; color: var(--text-muted);">${
              book.isbn
            }</span></td>
            <td>
                <span class="badge ${
                  book.status === "Available" ? "badge-success" : "badge-danger"
                }">
                    ${book.status}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button onclick="window.loadEdit(${
                      book.id
                    })" class="btn btn-sm btn-outline" title="Edit">
                        <i class='bx bx-edit-alt'></i>
                    </button>
                    <button onclick="window.handleDelete(${
                      book.id
                    })" class="btn btn-sm btn-outline" style="color: var(--danger); border-color: var(--border);" title="Delete">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");

  return `
        <div class="table-container">
            <table class="data-table">
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
