// Main App Initialization
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('TaskFlow App Starting...');
        
        // Initialize router
        Router.init();
        
        // Check authentication status
        const isAuthenticated = Auth.isAuthenticated();
        console.log('User authenticated:', isAuthenticated);
        
        if (isAuthenticated) {
            console.log('Current user:', Auth.getUser());
        }
    }
}

// Start the application
new App();
