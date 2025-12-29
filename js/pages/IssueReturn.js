import Store from "../core/Store.js";

export default function IssueReturn() {
  const transactions = Store.getTransactions();
  const active = transactions.filter((t) => t.status === "Issued");
  const settings = Store.getSettings();

  const rows = active
    .map((tx) => {
      const today = new Date();
      const due = new Date(tx.dueDate);
      const isLate = today > due;

      // Calculate potential fine for display
      let fine = 0;
      if (isLate) {
        const diffDays = Math.ceil(
          Math.abs(today - due) / (1000 * 60 * 60 * 24)
        );
        fine = diffDays * settings.finePerDay;
      }

      return `
            <tr>
                <td><strong>${tx.bookTitle}</strong></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class='bx bx-user-circle'></i> ${tx.username}
                    </div>
                </td>
                <td>${new Date(tx.issueDate).toLocaleDateString()}</td>
                <td>
                    ${new Date(tx.dueDate).toLocaleDateString()}
                    ${
                      isLate
                        ? `<br><span class="badge badge-danger" style="margin-top: 5px;">LATE ($${fine})</span>`
                        : ""
                    }
                </td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="window.processReturn(${
                      tx.id
                    })">
                        <i class='bx bx-check'></i> Return
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  return `
        <div class="fade-in">
            <header class="page-header">
                <h1 class="page-title">Circulation Desk</h1>
                <p class="page-subtitle">Manage issued books and returns</p>
            </header>

            <div class="card table-container">
                <table class="data-table">
                    <thead><tr><th>Book</th><th>Student</th><th>Issued On</th><th>Return Due</th><th>Action</th></tr></thead>
                    <tbody>${
                      rows.length
                        ? rows
                        : '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No active issues.</td></tr>'
                    }</tbody>
                </table>
            </div>
        </div>
    `;
}
