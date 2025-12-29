import Store from "../core/Store.js";

export default function Users() {
  const students = Store.getUsers();

  const rows = students
    .map(
      (u) => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; background: var(--secondary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">
                        ${u.username.charAt(0).toUpperCase()}
                    </div>
                    <strong>${u.username}</strong>
                </div>
            </td>
            <td><span style="color: var(--text-muted);">Student</span></td>
            <td>
                ${
                  u.isBanned
                    ? '<span class="badge badge-danger">BANNED</span>'
                    : '<span class="badge badge-success">Active</span>'
                }
            </td>
            <td>
                <button class="btn btn-sm ${
                  u.isBanned ? "btn-success" : "btn-danger"
                }" onclick="window.toggleBan('${u.username}')">
                    ${
                      u.isBanned
                        ? "<i class='bx bx-check-circle'></i> Unban"
                        : "<i class='bx bx-block'></i> Ban User"
                    }
                </button>
            </td>
        </tr>
    `
    )
    .join("");

  return `
        <div class="fade-in">
            <header class="page-header">
                <h1 class="page-title">Manage Students</h1>
                <p class="page-subtitle">Control user access and status</p>
            </header>

            <div class="card table-container">
                <table class="data-table">
                    <thead><tr><th>Username</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}
