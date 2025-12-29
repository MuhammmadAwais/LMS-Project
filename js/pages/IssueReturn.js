import Store from "../core/Store.js";

export default function IssueReturn() {
  const transactions = Store.getTransactions();

  // Filter active issues
  const activeIssues = transactions.filter((t) => t.status === "Issued");

  // Sort by Due Date (Overdue first)
  activeIssues.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const rows = activeIssues
    .map((tx) => {
      const dueDate = new Date(tx.dueDate).toLocaleDateString();
      const isOverdue = new Date() > new Date(tx.dueDate);

      return `
            <tr style="${
              isOverdue ? "background: rgba(239, 68, 68, 0.05);" : ""
            }">
                <td>
                    <strong>${tx.bookTitle}</strong>
                </td>
                <td>${tx.username}</td>
                <td>${dueDate} ${
        isOverdue
          ? '<span style="color:red; font-weight:bold; font-size:0.8rem;">(LATE)</span>'
          : ""
      }</td>
                <td>
                    <button class="btn btn-success" onclick="window.processReturn(${
                      tx.id
                    })">Receive Return</button>
                </td>
            </tr>
        `;
    })
    .join("");

  return `
        <div class="fade-in">
            <h1 style="margin-bottom: 2rem;">Circulation Desk</h1>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem; margin-bottom:2rem;">
                <div class="card" style="border-left:4px solid var(--primary);">
                    <h3>Issue a Book</h3>
                    <p style="color:var(--text-muted); margin-bottom:1rem;">Manually issue a book to a student.</p>
                    <button class="btn btn-primary" onclick="window.manualIssue()">New Issue Record</button>
                </div>
                <div class="card" style="border-left:4px solid var(--danger);">
                     <h3>Active Issues: ${activeIssues.length}</h3>
                     <p style="color:var(--text-muted);">Books currently out with students.</p>
                </div>
            </div>

            <div class="card">
                <h3>Currently Issued Books</h3>
                <table>
                    <thead><tr><th>Book</th><th>Student</th><th>Due Date</th><th>Action</th></tr></thead>
                    <tbody>${
                      rows.length
                        ? rows
                        : '<tr><td colspan="4">No books currently issued.</td></tr>'
                    }</tbody>
                </table>
            </div>
        </div>
    `;
}
