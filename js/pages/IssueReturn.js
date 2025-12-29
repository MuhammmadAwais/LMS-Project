import Store from "../core/Store.js";

export default function IssueReturn() {
  const books = Store.getBooks();

  // 1. Pending Requests
  const requestedBooks = books.filter((b) => b.status === "Requested");

  const requestHTML =
    requestedBooks
      .map(
        (b) => `
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-left: 4px solid orange;">
            <div>
                <strong>${b.title}</strong> requested by <span style="font-size: 1.1rem; font-weight: bold; color: var(--primary);">${b.requestedBy}</span>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-success" onclick="window.approveRequest(${b.id})">Approve</button>
                <button class="btn btn-danger" onclick="window.rejectRequest(${b.id})">Reject</button>
            </div>
        </div>
    `
      )
      .join("") ||
    '<p style="color: var(--text-muted);">No pending requests.</p>';

  // 2. Currently Issued
  const issuedBooks = books.filter((b) => b.status === "Issued");

  const issuedHTML =
    issuedBooks
      .map(
        (b) => `
         <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-left: 4px solid var(--danger);">
            <div>
                <strong>${b.title}</strong> held by <b>${b.holder}</b>
            </div>
            <button class="btn btn-outline" onclick="window.handleReturn(${b.id})">Revoke / Return</button>
        </div>
    `
      )
      .join("") ||
    '<p style="color: var(--text-muted);">No books currently issued.</p>';

  return `
        <div class="fade-in">
            <h1 style="margin-bottom: 2rem;">Requests & Issues</h1>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem;">
                <div>
                    <h3 style="margin-bottom: 1rem; color: orange;">Pending Requests</h3>
                    ${requestHTML}
                </div>
                <div>
                    <h3 style="margin-bottom: 1rem; color: var(--danger);">Active Issues</h3>
                    ${issuedHTML}
                </div>
            </div>
        </div>
    `;
}
