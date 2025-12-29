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
                <td>${tx.bookTitle}</td>
                <td>${due}</td>
                <td><span style="color:orange;">Active</span></td>
            </tr>
        `;
    })
    .join("");

  const historyRows = history
    .map(
      (tx) => `
        <tr>
            <td>${tx.bookTitle}</td>
            <td>Returned: ${new Date(tx.returnDate).toLocaleDateString()}</td>
            <td>${
              tx.fine > 0
                ? `<span style="color:red;">$${tx.fine} Fine Paid</span>`
                : '<span style="color:green;">On Time</span>'
            }</td>
        </tr>
    `
    )
    .join("");

  return `
        <div class="fade-in">
            <h1>My Library Card</h1>
            
            <div class="card" style="margin-top:2rem;">
                <h3 style="color:var(--primary);">Currently Borrowed</h3>
                <table>
                    <thead><tr><th>Book</th><th>Due Date</th><th>Status</th></tr></thead>
                    <tbody>${
                      activeRows.length
                        ? activeRows
                        : '<tr><td colspan="3">No active books.</td></tr>'
                    }</tbody>
                </table>
            </div>

            <div class="card" style="margin-top:2rem; opacity: 0.8;">
                <h3>History</h3>
                <table>
                    <thead><tr><th>Book</th><th>Returned On</th><th>Remarks</th></tr></thead>
                    <tbody>${
                      historyRows.length
                        ? historyRows
                        : '<tr><td colspan="3">No history yet.</td></tr>'
                    }</tbody>
                </table>
            </div>
        </div>
    `;
}
