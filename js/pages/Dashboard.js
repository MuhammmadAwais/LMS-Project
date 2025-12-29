// js/pages/Dashboard.js
import Store from "../core/Store.js";
import StatCard from "../components/StatCard.js";

export default function Dashboard() {
  const books = Store.getBooks();
  const total = books.length;
  const available = books.filter((b) => b.status === "Available").length;
  const issued = total - available;

  return `
        <div class="fade-in">
            <header style="margin-bottom: 2rem;">
                <h1>Dashboard Overview</h1>
                <p style="color: var(--text-muted);">Welcome back, Admin.</p>
            </header>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
                ${StatCard("Total Books", total, "var(--primary)")}
                ${StatCard("Available Now", available, "var(--success)")}
                ${StatCard("Currently Issued", issued, "var(--danger)")}
            </div>
        </div>
    `;
}
