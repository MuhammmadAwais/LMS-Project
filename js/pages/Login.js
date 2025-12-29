export default function Login() {
  return `
        <div style="max-width: 400px; margin: 4rem auto; text-align: center;" class="fade-in">
            <h1 style="color: var(--primary); margin-bottom: 2rem;">Welcome Back</h1>
            <div class="card" style="text-align: left;">
                <h3 style="margin-bottom: 1.5rem;">Sign In</h3>
                <form id="loginForm">
                    <div class="input-group">
                        <label>Username (use 'admin')</label>
                        <input type="text" id="login_user" placeholder="admin" required>
                    </div>
                    <div class="input-group">
                        <label>Password (use '123')</label>
                        <input type="password" id="login_pass" placeholder="123" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Login System</button>
                </form>
                <p id="login-error" style="color: var(--danger); margin-top: 1rem; display: none;">Invalid credentials!</p>
            </div>
        </div>
    `;
}
