// js/components/StatCard.js
export default function StatCard(title, value, colorClass = "") {
  return `
        <div class="card hover-scale">
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${title}</p>
            <h2 style="font-size: 2rem; color: ${colorClass}">${value}</h2>
        </div>
    `;
}
