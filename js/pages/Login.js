export default function Login() {
  return `
        <div style="max-width: 400px; margin: 4rem auto; text-align: center;" class="fade-in">
            <h1 style="color: var(--primary); margin-bottom: 2rem;">LMS Portal</h1>
            
            <div class="card" style="text-align: left;">
                <div style="display: flex; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem;">
                    <button class="btn" id="tab-login" onclick="window.switchAuthTab('login')" style="flex: 1; border-radius: 0; border-bottom: 2px solid var(--primary);">Login</button>
                    <button class="btn" id="tab-signup" onclick="window.switchAuthTab('signup')" style="flex: 1; border-radius: 0; border-bottom: 2px solid transparent; color: var(--text-muted);">Signup</button>
                </div>

                <form id="loginForm">
                    <h3 style="margin-bottom: 1rem;">Sign In</h3>
                    
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="radio" name="role" value="student" checked> Student
                        </label>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="radio" name="role" value="admin"> Admin
                        </label>
                    </div>

                    <div class="input-group">
                        <label>Username</label>
                        <input type="text" id="login_user" required>
                    </div>
                    <div class="input-group">
                        <label>Password</label>
                        <input type="password" id="login_pass" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Login</button>
                    <p id="login-msg" style="color: var(--danger); margin-top: 1rem; display: none;"></p>
                </form>

                <form id="signupForm" style="display: none;">
                    <h3 style="margin-bottom: 1rem;">Student Registration</h3>
                    <div class="input-group">
                        <label>Choose Username</label>
                        <input type="text" id="sign_user" required>
                    </div>
                    <div class="input-group">
                        <label>Choose Password</label>
                        <input type="password" id="sign_pass" required>
                    </div>
                    <button type="submit" class="btn btn-success" style="width: 100%; margin-top: 1rem;">Create Account</button>
                    <p id="signup-msg" style="color: var(--success); margin-top: 1rem; display: none;"></p>
                </form>

            </div>
        </div>
    `;
}
