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
                <td>${tx.bookTitle}</td>
                <td>${tx.username}</td>
                <td>${new Date(tx.issueDate).toLocaleDateString()}</td>
                <td>
                    ${new Date(tx.dueDate).toLocaleDateString()}
                    ${
                      isLate
                        ? `<br><span style="color:red; font-size:0.8rem;">LATE (${fine} fine)</span>`
                        : ""
                    }
                </td>
                <td>
                    <button class="btn btn-success" onclick="window.processReturn(${
                      tx.id
                    })">Return Book</button>
                </td>
            </tr>
        `;
    })
    .join("");

  return `
        <div class="fade-in">
            <h1>Circulation Desk</h1>
            <div class="card">
                <h3>Issued Books</h3>
                <table>
                    <thead><tr><th>Book</th><th>Student</th><th>Issued On</th><th>Return Due</th><th>Action</th></tr></thead>
                    <tbody>${
                      rows.length
                        ? rows
                        : '<tr><td colspan="5">No active issues.</td></tr>'
                    }</tbody>
                </table>
            </div>
        </div>
    `;
}
