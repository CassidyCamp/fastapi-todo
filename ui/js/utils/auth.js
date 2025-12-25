// Authentication Utility
const Auth = {
    TOKEN_KEY: 'taskflow_token',
    USER_KEY: 'taskflow_user',

    // Store token in localStorage
    setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    },

    // Get token from localStorage
    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    // Remove token
    removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    },

    // Store user data
    setUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    },

    // Get user data
    getUser() {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Get authorization header
    getAuthHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // Login
    async login(username, password) {
        try {
            // Create Basic Auth credentials
            const credentials = btoa(`${username}:${password}`);
            
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();
            this.setToken(data.token);
            
            // Fetch user profile
            const user = await this.fetchUserProfile();
            this.setUser(user);

            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    // Register
    async register(username, password) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, confirm: password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Registration failed');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },

    // Fetch user profile
    async fetchUserProfile() {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.PROFILE}`, {
            headers: {
                ...this.getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        return await response.json();
    },

    // Logout
    logout() {
        this.removeToken();
        window.location.href = '/';
    }
};
