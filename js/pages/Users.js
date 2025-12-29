import Store from "../core/Store.js";

export default function Users() {
  const students = Store.getUsers();

  const rows = students
    .map(
      (u) => `
        <tr>
            <td>${u.username}</td>
            <td>Student</td>
            <td>
                ${
                  u.isBanned
                    ? '<span style="color:red; font-weight:bold;">BANNED</span>'
                    : '<span style="color:green;">Active</span>'
                }
            </td>
            <td>
                <button class="btn ${
                  u.isBanned ? "btn-success" : "btn-danger"
                }" onclick="window.toggleBan('${u.username}')">
                    ${u.isBanned ? "Unban User" : "Ban User"}
                </button>
            </td>
        </tr>
    `
    )
    .join("");

  return `
        <div class="fade-in">
            <h1>Manage Students</h1>
            <div class="card" style="margin-top: 1rem;">
                <table>
                    <thead><tr><th>Username</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}
