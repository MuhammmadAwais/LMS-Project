import Store from "../core/Store.js";

export default function IssueReturn() {
  const books = Store.getBooks(); // Get all books

  // Split books into two lists
  const availableBooks = books.filter((b) => b.status === "Available");
  const issuedBooks = books.filter((b) => b.status === "Issued");

  const availableHTML =
    availableBooks
      .map(
        (b) => `
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 1rem;">
            <div>
                <strong>${b.title}</strong> <span style="color: var(--text-muted);">(${b.isbn})</span>
            </div>
            <button class="btn btn-primary" onclick="window.openIssueModal(${b.id}, '${b.title}')">Issue</button>
        </div>
    `
      )
      .join("") ||
    '<p style="color: var(--text-muted);">No books available.</p>';

  const issuedHTML =
    issuedBooks
      .map(
        (b) => `
         <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 1rem; border-left: 4px solid var(--danger);">
            <div>
                <strong>${b.title}</strong>
                <div style="font-size: 0.9rem; color: var(--text-muted);">Held by: <b>${b.holder}</b></div>
            </div>
            <button class="btn btn-success" onclick="window.handleReturn(${b.id})">Return</button>
        </div>
    `
      )
      .join("") ||
    '<p style="color: var(--text-muted);">No books currently issued.</p>';

  return `
        <div class="fade-in">
            <h1 style="margin-bottom: 2rem;">Issue & Return Desk</h1>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem;">
                <div>
                    <h3 style="margin-bottom: 1rem; color: var(--success);">Available for Issue</h3>
                    ${availableHTML}
                </div>

                <div>
                    <h3 style="margin-bottom: 1rem; color: var(--primary);">Currently Issued</h3>
                    ${issuedHTML}
                </div>
            </div>
        </div>
    `;
}
