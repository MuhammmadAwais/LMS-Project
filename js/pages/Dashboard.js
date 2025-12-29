import Store from "../core/Store.js";
import Auth from "../core/Auth.js";
import StatCard from "../components/StatCard.js";

export default function Dashboard() {
  const user = Auth.getUser();
  const books = Store.getBooks();
  const total = books.length;
  const available = books.filter((b) => b.status === "Available").length;
  const issued = total - available;
  const totalUsers = Store.getUsers().length;

  return `
    <div class="fade-in">
        <header class="page-header" style="display: flex; justify-content: space-between; align-items: end;">
            <div>
                <h1 class="page-title">Overview</h1>
                <p class="page-subtitle">Welcome back, ${
                  user.username
                }. Here's what's happening.</p>
            </div>
            <button class="btn btn-primary" onclick="window.location.hash='books'">
                <i class='bx bx-plus-circle'></i> New Book
            </button>
        </header>

        <div class="card" style="background: linear-gradient(135deg, var(--secondary), #0f172a); color: white; border: none; padding: 2.5rem; margin-bottom: 2.5rem; position: relative; overflow: hidden;">
            <div style="position: relative; z-index: 2; max-width: 60%;">
                <h2 style="color: white; font-size: 2rem; margin-bottom: 0.75rem;">Manage your library with ease.</h2>
                <p style="opacity: 0.9; font-size: 1.1rem; margin-bottom: 1.5rem;">Track inventory, manage circulation, and organize users efficiently with Athena's classic yet modern tools.</p>
            </div>
            <i class='bx bxs-book-heart' style="position: absolute; right: -20px; bottom: -30px; font-size: 12rem; opacity: 0.15; transform: rotate(-15deg);"></i>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
            ${StatCard(
              "Total Books",
              total,
              "bx bxs-collection",
              "var(--secondary)"
            )}
            ${StatCard(
              "Available Copies",
              available,
              "bx bx-check-shield",
              "var(--success)"
            )}
            ${StatCard(
              "Currently Issued",
              issued,
              "bx bx-time-five",
              "var(--warning)"
            )}
            ${StatCard(
              "Registered Users",
              totalUsers,
              "bx bxs-group",
              "var(--primary)"
            )}
        </div>
    </div>
  `;
}
