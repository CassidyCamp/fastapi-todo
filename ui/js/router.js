// Router
const Router = {
    routes: {
        'login': LoginPage,
        'register': RegisterPage,
        'dashboard': DashboardPage
    },

    currentPage: null,

    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial load
        this.handleRoute();
    },

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'login';
        const route = hash.split('/')[0]; // Handle routes like #dashboard/task/123
        
        // Check authentication
        const isAuthenticated = Auth.isAuthenticated();
        const publicRoutes = ['login', 'register'];
        
        if (!isAuthenticated && !publicRoutes.includes(route)) {
            window.location.hash = '#login';
            return;
        }
        
        if (isAuthenticated && publicRoutes.includes(route)) {
            window.location.hash = '#dashboard';
            return;
        }

        this.loadPage(route);
    },

    loadPage(route) {
        const page = this.routes[route];
        
        if (!page) {
            console.error('Route not found:', route);
            window.location.hash = '#login';
            return;
        }

        // Update current page
        this.currentPage = page;
        
        // Render page
        const app = document.getElementById('app');
        app.innerHTML = page.render();
        
        // Mount page (attach event listeners, load data, etc.)
        if (page.mount) {
            page.mount();
        }

        // Update navbar active link
        if (Navbar.highlightActiveLink) {
            Navbar.highlightActiveLink();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    },

    navigate(route) {
        window.location.hash = `#${route}`;
    }
};
