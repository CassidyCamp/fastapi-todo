// Login Page
const LoginPage = {
    render() {
        return `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
                <div class="card fade-in" style="max-width: 480px; width: 100%; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
                    <div style="text-align: center; margin-bottom: 2.5rem;">
                        <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; background: linear-gradient(135deg, var(--primary), var(--highlight)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            TaskFlow
                        </h1>
                        <p style="color: var(--text-secondary); font-size: 1rem;">
                            Sign in to manage your tasks
                        </p>
                    </div>

                    <form id="loginForm" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                                Username
                            </label>
                            <input 
                                type="text" 
                                name="username" 
                                class="input-field" 
                                placeholder="Enter your username"
                                required
                                autocomplete="username"
                            >
                        </div>

                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                                Password
                            </label>
                            <input 
                                type="password" 
                                name="password" 
                                class="input-field" 
                                placeholder="Enter your password"
                                required
                                autocomplete="current-password"
                            >
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1rem; margin-top: 0.5rem;">
                            Sign In
                        </button>
                    </form>

                    <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border);">
                        <p style="color: var(--text-secondary);">
                            Don't have an account? 
                            <a href="#register" style="color: var(--highlight); font-weight: 600; text-decoration: none; margin-left: 0.25rem;">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    mount() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e);
        });
    },

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        // Disable form
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';
        submitBtn.style.opacity = '0.7';

        try {
            const result = await Auth.login(username, password);
            
            if (result.success) {
                Toast.success('Login successful!');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.hash = '#dashboard';
                }, 500);
            } else {
                Toast.error(result.error || 'Login failed');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
            }
        } catch (error) {
            Toast.error('An error occurred during login');
            console.error(error);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    }
};
