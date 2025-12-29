import Store from "../core/Store.js";

export default function Settings() {
  const settings = Store.getSettings();

  return `
        <div class="fade-in">
            <header class="page-header">
                <h1 class="page-title">System Settings</h1>
                <p class="page-subtitle">Configure library rules and fines</p>
            </header>

            <div class="card" style="max-width: 500px;">
                <form id="settingsForm">
                    <div class="form-group">
                        <label class="form-label">Fine Per Day ($)</label>
                        <div class="input-wrapper">
                            <i class='bx bx-dollar'></i>
                            <input type="number" id="s_fine" class="form-input" value="${settings.finePerDay}" required>
                        </div>
                        <small style="color:var(--text-muted); display: block; margin-top: 5px;">Amount charged per day after due date.</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Max Borrowing Duration (Days)</label>
                        <div class="input-wrapper">
                            <i class='bx bx-calendar-event'></i>
                            <input type="number" id="s_days" class="form-input" value="${settings.maxBorrowDays}" required>
                        </div>
                        <small style="color:var(--text-muted); display: block; margin-top: 5px;">Maximum days a student can hold a book.</small>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width:100%; margin-top: 1rem;">
                        <i class='bx bx-save'></i> Save Settings
                    </button>
                </form>
            </div>
        </div>
    `;
}
