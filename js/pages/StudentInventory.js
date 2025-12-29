import Store from "../core/Store.js";
import Auth from "../core/Auth.js";

export default function StudentInventory() {
  const user = Auth.getUser();
  const allTx = Store.getTransactions().filter(
    (t) => t.username === user.username
  );

  const active = allTx.filter((t) => t.status === "Issued");
  const history = allTx.filter((t) => t.status === "Returned");

  const activeRows = active
    .map((tx) => {
      const due = new Date(tx.dueDate).toLocaleDateString();
      return `
            <tr>
                <td><strong>${tx.bookTitle}</strong></td>
                <td><i class='bx bx-calendar'></i> ${due}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="window.studentReturn(${tx.id})">
                        <i class='bx bx-revision'></i> Return Now
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  const historyRows = history
    .map(
      (tx) => `
        <tr>
            <td>${tx.bookTitle}</td>
            <td>${new Date(tx.returnDate).toLocaleDateString()}</td>
            <td>${
              tx.fine > 0
                ? `<span class="badge badge-danger">Paid $${tx.fine} Fine</span>`
                : '<span class="badge badge-success">On Time</span>'
            }</td>
        </tr>
    `
    )
    .join("");

  return `
        <div class="fade-in">
            <header class="page-header">
                <h1 class="page-title">My Library Card</h1>
                <p class="page-subtitle">Your borrowing history and active books</p>
            </header>
            
            <div class="card" style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem; color: var(--primary); display: flex; align-items: center; gap: 10px;">
                    <i class='bx bx-book-open'></i> Currently Borrowed
                </h3>
                <div class="table-container">
                    <table class="data-table">
                        <thead><tr><th>Book</th><th>Due Date</th><th>Action</th></tr></thead>
                        <tbody>${
                          activeRows.length
                            ? activeRows
                            : '<tr><td colspan="3" style="text-align:center; color: var(--text-muted);">No active books.</td></tr>'
                        }</tbody>
                    </table>
                </div>
            </div>

            <div class="card" style="opacity: 0.9;">
                <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
                    <i class='bx bx-history'></i> History
                </h3>
                <div class="table-container">
                    <table class="data-table">
                        <thead><tr><th>Book</th><th>Returned On</th><th>Remarks</th></tr></thead>
                        <tbody>${
                          historyRows.length
                            ? historyRows
                            : '<tr><td colspan="3" style="text-align:center; color: var(--text-muted);">No history yet.</td></tr>'
                        }</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
