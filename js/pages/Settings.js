import Store from "../core/Store.js";

export default function Settings() {
  const settings = Store.getSettings();

  return `
        <div class="fade-in">
            <h1>System Settings</h1>
            <div class="card" style="max-width: 500px; margin-top:2rem;">
                <form id="settingsForm">
                    <div class="input-group">
                        <label>Fine Per Day ($)</label>
                        <input type="number" id="s_fine" value="${settings.finePerDay}" required>
                        <small style="color:var(--text-muted);">Amount charged per day after due date.</small>
                    </div>
                    <div class="input-group">
                        <label>Max Borrowing Duration (Days)</label>
                        <input type="number" id="s_days" value="${settings.maxBorrowDays}" required>
                        <small style="color:var(--text-muted);">Maximum days a student can hold a book.</small>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%;">Save Settings</button>
                </form>
            </div>
        </div>
    `;
}
