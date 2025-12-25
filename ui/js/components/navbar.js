// Navbar Component
const Navbar = {
    render() {
        const user = Auth.getUser();
        
        return `
            <nav style="background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100;">
                <div class="container" style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 2rem;">
                    <div style="display: flex; align-items: center; gap: 2rem;">
                        <h1 style="font-size: 1.75rem; font-weight: 700; color: var(--primary); letter-spacing: -0.5px;">
                            TaskFlow
                        </h1>
                        ${user ? `
                            <div style="display: flex; gap: 1.5rem;">
                                <a href="#dashboard" class="nav-link" style="color: var(--text-secondary); font-weight: 500; text-decoration: none; transition: color 0.3s; padding: 0.5rem 0; border-bottom: 2px solid transparent;">
                                    Dashboard
                                </a>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 1.5rem;">
                        ${user ? `
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="text-align: right;">
                                    <div style="font-weight: 600; color: var(--text-primary);">
                                        ${user.username || 'User'}
                                    </div>
                                    <div style="font-size: 0.75rem; color: var(--text-secondary);">
                                        ${user.email || ''}
                                    </div>
                                </div>
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--highlight), var(--accent)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1rem;">
                                    ${(user.username || 'U').charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <button id="logoutBtn" class="btn btn-outline" style="padding: 0.625rem 1.25rem;">
                                Logout
                            </button>
                        ` : `
                            <a href="#login" class="btn btn-outline" style="padding: 0.625rem 1.25rem; text-decoration: none; display: inline-block;">
                                Login
                            </a>
                            <a href="#register" class="btn btn-primary" style="padding: 0.625rem 1.25rem; text-decoration: none; display: inline-block;">
                                Sign Up
                            </a>
                        `}
                    </div>
                </div>
            </nav>
        `;
    },

    mount() {
        this.attachEventListeners();
        this.highlightActiveLink();
    },

    attachEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.logout();
                Toast.success('Logged out successfully');
            });
        }

        // Add hover effect to nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                e.target.style.color = 'var(--highlight)';
                e.target.style.borderBottomColor = 'var(--highlight)';
            });
            link.addEventListener('mouseleave', (e) => {
                if (!e.target.classList.contains('active')) {
                    e.target.style.color = 'var(--text-secondary)';
                    e.target.style.borderBottomColor = 'transparent';
                }
            });
        });
    },

    highlightActiveLink() {
        const currentHash = window.location.hash || '#dashboard';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
                link.style.color = 'var(--highlight)';
                link.style.borderBottomColor = 'var(--highlight)';
            } else {
                link.classList.remove('active');
                link.style.color = 'var(--text-secondary)';
                link.style.borderBottomColor = 'transparent';
            }
        });
    }
};
