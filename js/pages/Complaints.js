import Store from "../core/Store.js";
import Auth from "../core/Auth.js";

export default function Complaints() {
  const user = Auth.getUser();
  const isAdmin = user && user.role === "admin";
  const complaints = Store.getComplaints();

  let content = "";

  if (isAdmin) {
    const rows = complaints
      .map(
        (c) => `
            <tr>
                <td><strong>${c.user}</strong></td>
                <td>
                    <p>${c.text}</p>
                    ${
                      c.reply
                        ? `<p style="color:var(--success); font-size:0.9rem; border-left:2px solid var(--success); padding-left:5px; margin-top:5px;"><strong>Reply:</strong> ${c.reply}</p>`
                        : ""
                    }
                </td>
                <td>${new Date(c.date).toLocaleDateString()}</td>
                <td>
                    ${
                      c.status === "Resolved"
                        ? '<span style="color:green;">✔ Resolved</span>'
                        : `<button class="btn btn-primary" onclick="window.openReply(${c.id})">Reply</button>`
                    }
                </td>
            </tr>
        `
      )
      .join("");

    content = `
            <h3>User Complaints & Feedback</h3>
            <div class="table-container">
                <table>
                    <thead><tr><th>User</th><th>Complaint / Reply</th><th>Date</th><th>Action</th></tr></thead>
                    <tbody>${
                      rows.length
                        ? rows
                        : '<tr><td colspan="4">No complaints found.</td></tr>'
                    }</tbody>
                </table>
            </div>
        `;
  } else {
    // Student View
    const myComplaints = complaints.filter((c) => c.user === user.username);
    const historyRows = myComplaints
      .map(
        (c) => `
            <div class="card" style="margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between;">
                    <strong>${new Date(c.date).toLocaleDateString()}</strong>
                    <span style="color:${
                      c.status === "Resolved" ? "green" : "orange"
                    }">${c.status}</span>
                </div>
                <p style="margin-top:0.5rem;">${c.text}</p>
                ${
                  c.reply
                    ? `<hr><p style="color:var(--success);"><strong>Admin Reply:</strong> ${c.reply}</p>`
                    : ""
                }
            </div>
        `
      )
      .join("");

    content = `
            <h3>Submit a Complaint / Feedback</h3>
            <form id="complaintForm" style="margin-top:1rem; margin-bottom:2rem;">
                <textarea id="c_text" rows="4" placeholder="Describe your issue..." style="width:100%; padding:0.5rem; border-radius:6px; border:1px solid var(--border);" required></textarea>
                <button type="submit" class="btn btn-danger" style="margin-top:1rem;">Submit Complaint</button>
            </form>
            <h3>My History</h3>
            ${historyRows || "<p>No history yet.</p>"}
        `;
  }

  return `
        <div class="fade-in">
            <h1>Help & Support</h1>
            <div class="card" style="margin-top:1rem;">
                ${content}
            </div>
        </div>
    `;
}
