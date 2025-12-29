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
                <td>${c.user}</td>
                <td>${c.text}</td>
                <td>${new Date(c.date).toLocaleDateString()}</td>
                <td><span style="padding:2px 6px; background:#e0e7ff; color:blue; border-radius:4px;">${
                  c.status
                }</span></td>
            </tr>
        `
      )
      .join("");

    content = `
            <h3>All User Complaints</h3>
            <table>
                <thead><tr><th>User</th><th>Complaint</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>${
                  rows.length
                    ? rows
                    : '<tr><td colspan="4">No complaints.</td></tr>'
                }</tbody>
            </table>
        `;
  } else {
    content = `
            <h3>Submit a Complaint / Feedback</h3>
            <form id="complaintForm" style="margin-top:1rem;">
                <textarea id="c_text" rows="5" placeholder="Describe your issue..." style="width:100%; padding:0.5rem; border-radius:6px; border:1px solid var(--border);" required></textarea>
                <button type="submit" class="btn btn-danger" style="margin-top:1rem;">Submit Complaint</button>
            </form>
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
