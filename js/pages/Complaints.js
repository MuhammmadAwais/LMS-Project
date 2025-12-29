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
                    <p style="margin-bottom: 0.5rem;">${c.text}</p>
                    ${
                      c.reply
                        ? `<div style="background: rgba(5, 150, 105, 0.1); padding: 8px; border-radius: 6px; border-left: 3px solid var(--success);">
                            <strong style="color: var(--success); font-size: 0.85rem;">Reply:</strong> <span style="font-size: 0.9rem;">${c.reply}</span>
                           </div>`
                        : ""
                    }
                </td>
                <td>${new Date(c.date).toLocaleDateString()}</td>
                <td>
                    <div style="display:flex; gap:8px; align-items:center;">
                        ${
                          c.status === "Resolved"
                            ? '<span class="badge badge-success"><i class="bx bx-check"></i> Resolved</span>'
                            : `<button class="btn btn-sm btn-primary" onclick="window.openReply(${c.id})"><i class='bx bx-reply'></i> Reply</button>`
                        }
                        <button onclick="window.handleDeleteComplaint(${
                          c.id
                        })" class="btn btn-sm btn-outline" style="color: var(--danger); border-color: var(--danger);">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `
      )
      .join("");

    content = `
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>User</th><th>Complaint / Reply</th><th>Date</th><th>Action</th></tr></thead>
                    <tbody>${
                      rows.length
                        ? rows
                        : '<tr><td colspan="4" style="text-align:center;">No complaints found.</td></tr>'
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
            <div class="card" style="margin-bottom:1rem; border: 1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
                    <div style="font-size: 0.9rem; color: var(--text-muted);">${new Date(
                      c.date
                    ).toLocaleDateString()}</div>
                    <div style="display:flex; gap:10px; align-items: center;">
                        <span class="badge ${
                          c.status === "Resolved"
                            ? "badge-success"
                            : "badge-warning"
                        }">${c.status}</span>
                        <button onclick="window.handleDeleteComplaint(${
                          c.id
                        })" style="color:var(--danger); background:none; border:none; cursor:pointer;">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </div>
                <p style="font-size: 1.05rem; margin-bottom: 0.5rem;">${
                  c.text
                }</p>
                ${
                  c.reply
                    ? `<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                        <p style="color:var(--success); font-weight: 500;"><i class='bx bx-message-check'></i> Admin Reply: ${c.reply}</p>
                       </div>`
                    : ""
                }
            </div>
        `
      )
      .join("");

    content = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    <h3><i class='bx bx-edit'></i> Submit a Complaint</h3>
                    <form id="complaintForm" style="margin-top:1rem;">
                        <div class="form-group">
                            <textarea id="c_text" class="form-input" rows="5" placeholder="Describe your issue in detail..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-danger" style="width: 100%;">
                            <i class='bx bx-send'></i> Submit Complaint
                        </button>
                    </form>
                </div>
                
                <div>
                    <h3><i class='bx bx-list-ul'></i> My History</h3>
                    <div style="margin-top: 1rem;">
                        ${
                          historyRows ||
                          "<p style='color: var(--text-muted);'>No history yet.</p>"
                        }
                    </div>
                </div>
            </div>
        `;
  }

  return `
        <div class="fade-in">
            <header class="page-header">
                <h1 class="page-title">Help & Support</h1>
                <p class="page-subtitle">We are here to help you</p>
            </header>
            
            <div class="card">
                ${content}
            </div>
        </div>
    `;
}
