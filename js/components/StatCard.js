export default function StatCard(title, value, iconClass, color) {
  return `
    <div class="card hover-scale" style="display: flex; align-items: center; justify-content: space-between;">
        <div>
            <p style="color: var(--text-muted); font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem;">${title}</p>
            <h2 style="font-size: 2.5rem; font-weight: 700; line-height: 1; color: var(--text-main);">${value}</h2>
        </div>
        <div style="
            width: 60px; height: 60px; 
            border-radius: 16px; 
            background: ${color}20; /* 20% opacity of the color */
            color: ${color}; 
            display: flex; align-items: center; justify-content: center; 
            font-size: 2rem;
            box-shadow: 0 4px 10px ${color}30;">
            <i class='${iconClass}'></i>
        </div>
    </div>
  `;
}
