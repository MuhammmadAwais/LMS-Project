import Auth from "../core/Auth.js";

export default function Login() {
  // Attach event listeners after the HTML is injected
  setTimeout(() => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const tabLogin = document.getElementById("tab-login");
    const tabSignup = document.getElementById("tab-signup");
    const signupMsg = document.getElementById("signup-msg");

    // --- Tab Switching Logic ---
    window.switchAuthTab = (tab) => {
      if (tab === "login") {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
      } else {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        tabLogin.classList.remove("active");
        tabSignup.classList.add("active");
        signupMsg.style.display = "none";
      }
    };

    // --- Login Submission ---
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = e.target.login_user.value;
        const password = e.target.login_pass.value;
        const role = document.querySelector('input[name="role"]:checked').value;

        if (Auth.login(username, password, role)) {
          window.location.hash = "dashboard";
        } else {
          alert("Invalid credentials!");
        }
      });
    }

    // --- Signup Submission ---
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = e.target.sign_user.value;
        const password = e.target.sign_pass.value;

        if (Auth.signup(username, password)) {
          signupMsg.textContent = "Account created successfully! Please login.";
          signupMsg.style.display = "block";
          signupMsg.style.color = "var(--success)";
          e.target.reset();
          // Optionally switch back to login tab after a delay
          setTimeout(() => window.switchAuthTab("login"), 1500);
        } else {
          signupMsg.textContent = "Username already exists.";
          signupMsg.style.display = "block";
          signupMsg.style.color = "var(--danger)";
        }
      });
    }
  }, 0);

  return `
    <div class="login-container fade-in">
        <div class="login-hero">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="brand-font" style="font-size: 4rem; color: white; margin-bottom: 1rem;">Athena.</h1>
                <p style="font-size: 1.5rem; color: rgba(255,255,255,0.9); font-family: var(--font-header); font-style: italic;">"The only thing that you absolutely have to know, is the location of the library."</p>
                <p style="margin-top: 1rem; color: var(--primary); font-weight: 600;">— Albert Einstein</p>
            </div>
        </div>

        <div class="login-form-wrapper">
            <div class="auth-card card">
                <div class="auth-tabs">
                    <button class="auth-tab active" id="tab-login" onclick="window.switchAuthTab('login')">Sign In</button>
                    <button class="auth-tab" id="tab-signup" onclick="window.switchAuthTab('signup')">Register</button>
                </div>

                <form id="loginForm">
                    <h2 style="margin-bottom: 0.5rem;">Welcome Back</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Access the library collection.</p>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label class="form-label">I am a:</label>
                        <div class="role-selector">
                            <label class="role-option">
                                <input type="radio" name="role" value="student" checked>
                                <span class="role-card"><i class='bx bxs-user'></i> Student</span>
                            </label>
                            <label class="role-option">
                                <input type="radio" name="role" value="admin">
                                <span class="role-card"><i class='bx bxs-badge-check'></i> Admin</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="login_user" class="form-label">Username</label>
                        <div class="input-wrapper">
                            <i class='bx bx-user'></i>
                            <input type="text" id="login_user" class="form-input" placeholder="e.g. john.doe" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="login_pass" class="form-label">Password</label>
                        <div class="input-wrapper">
                            <i class='bx bx-lock-alt'></i>
                            <input type="password" id="login_pass" class="form-input" placeholder="•••••••" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem;">
                        Sign In <i class='bx bx-right-arrow-alt'></i>
                    </button>
                </form>

                <form id="signupForm" style="display: none;">
                    <h2 style="margin-bottom: 0.5rem;">Create Account</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Start your reading journey today.</p>
                    
                    <div class="form-group">
                        <label for="sign_user" class="form-label">Choose Username</label>
                        <div class="input-wrapper">
                            <i class='bx bx-user-plus'></i>
                            <input type="text" id="sign_user" class="form-input" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="sign_pass" class="form-label">Choose Password</label>
                        <div class="input-wrapper">
                            <i class='bx bx-key'></i>
                            <input type="password" id="sign_pass" class="form-input" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-secondary" style="width: 100%; padding: 1rem;">
                        Register Now <i class='bx bx-user-check'></i>
                    </button>
                    <p id="signup-msg" style="margin-top: 1rem; text-align: center; font-weight: 600;"></p>
                </form>
            </div>
        </div>
    </div>

    <style>
        .login-container { display: flex; height: 100vh; width: 100vw; background: var(--bg-body); }
        .login-hero { 
            flex: 1.2; position: relative;
            background: url('https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80') center/cover no-repeat;
            display: flex; align-items: center; justify-content: center; padding: 4rem;
        }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(26, 35, 50, 0.85), rgba(194, 65, 12, 0.5)); mix-blend-mode: multiply; }
        .hero-content { position: relative; z-index: 2; max-width: 500px; }
        
        .login-form-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; background: var(--bg-body); }
        .auth-card { width: 100%; max-width: 450px; padding: 3rem; border: none; box-shadow: var(--shadow-lg); }
        
        .auth-tabs { display: flex; margin-bottom: 2.5rem; border-bottom: 2px solid var(--border); }
        .auth-tab { flex: 1; padding: 1rem; background: none; border: none; font-family: var(--font-body); font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 3px solid transparent; margin-bottom: -2px; transition: 0.3s; font-size: 1.1rem; }
        .auth-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
        
        .role-selector { display: flex; gap: 1rem; }
        .role-option { flex: 1; cursor: pointer; }
        .role-option input { display: none; }
        .role-card { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; border: 2px solid var(--border); border-radius: var(--radius-sm); font-weight: 600; color: var(--text-muted); transition: 0.2s; }
        .role-option input:checked + .role-card { border-color: var(--primary); color: var(--primary); background: rgba(194, 65, 12, 0.08); }
        
        @media (max-width: 900px) { .login-hero { display: none; } .auth-card { padding: 2rem; box-shadow: none; } }
    </style>
  `;
}
