// Register Page
const RegisterPage = {
    render() {
        return `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
                <div class="card fade-in" style="max-width: 480px; width: 100%; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
                    <div style="text-align: center; margin-bottom: 2.5rem;">
                        <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; background: linear-gradient(135deg, var(--primary), var(--highlight)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            TaskFlow
                        </h1>
                        <p style="color: var(--text-secondary); font-size: 1rem;">
                            Create your account
                        </p>
                    </div>

                    <form id="registerForm" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                                Username
                            </label>
                            <input 
                                type="text" 
                                name="username" 
                                class="input-field" 
                                placeholder="Choose a username"
                                required
                                autocomplete="username"
                                minlength="3"
                            >
                            <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                At least 3 characters
                            </p>
                        </div>

                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                                Password
                            </label>
                            <input 
                                type="password" 
                                name="password" 
                                class="input-field" 
                                placeholder="Choose a password"
                                required
                                autocomplete="new-password"
                                minlength="6"
                            >
                            <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                At least 6 characters
                            </p>
                        </div>

                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                                Confirm Password
                            </label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                class="input-field" 
                                placeholder="Confirm your password"
                                required
                                autocomplete="new-password"
                            >
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1rem; margin-top: 0.5rem;">
                            Create Account
                        </button>
                    </form>

                    <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border);">
                        <p style="color: var(--text-secondary);">
                            Already have an account? 
                            <a href="#login" style="color: var(--highlight); font-weight: 600; text-decoration: none; margin-left: 0.25rem;">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    mount() {
        const form = document.getElementById('registerForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister(e);
        });
    },

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validate passwords match
        if (password !== confirmPassword) {
            Toast.error('Passwords do not match');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            Toast.error('Password must be at least 6 characters');
            return;
        }

        // Validate username length
        if (username.length < 3) {
            Toast.error('Username must be at least 3 characters');
            return;
        }

        // Disable form
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        submitBtn.style.opacity = '0.7';

        try {
            const result = await Auth.register(username, password, confirmPassword);
            
            if (result.success) {
                Toast.success('Account created successfully! Please login.');
                
                // Redirect to login
                setTimeout(() => {
                    window.location.hash = '#login';
                }, 1000);
            } else {
                Toast.error(result.error || 'Registration failed');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
            }
        } catch (error) {
            Toast.error('An error occurred during registration');
            console.error(error);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    }
};
