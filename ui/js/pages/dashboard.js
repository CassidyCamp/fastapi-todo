// Dashboard Page
const DashboardPage = {
    tasks: [],
    categories: [],
    filteredTasks: [],

    render() {
        const user = Auth.getUser();
        
        return `
            ${Navbar.render()}
            
            <div class="container" style="padding: 3rem 2rem;">
                <!-- Header -->
                <div class="fade-in" style="margin-bottom: 3rem;">
                    <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">
                        Welcome back, ${user?.username || 'User'}
                    </h1>
                    <p style="color: var(--text-secondary); font-size: 1.125rem;">
                        Here's what you need to focus on today
                    </p>
                </div>

                <!-- Stats Cards -->
                <div id="statsContainer" class="slide-in stagger-1" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                    ${this.renderStats()}
                </div>

                <!-- Filter Panel -->
                <div id="filterPanel" class="slide-in stagger-2">
                    ${this.renderFilterPanel()}
                </div>

                <!-- Actions Bar -->
                <div class="slide-in stagger-3" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.75rem; font-weight: 600;">
                        Tasks <span id="taskCount" style="color: var(--text-secondary); font-weight: 400; font-size: 1.25rem;">(0)</span>
                    </h2>
                    <button id="createTaskBtn" class="btn btn-primary">
                        + Create Task
                    </button>
                </div>

                <!-- Tasks Grid -->
                <div id="tasksContainer" class="slide-in stagger-3">
                    ${this.renderTasksLoading()}
                </div>
            </div>
        `;
    },

    renderStats() {
        return `
            <div class="skeleton" style="height: 120px;"></div>
            <div class="skeleton" style="height: 120px;"></div>
            <div class="skeleton" style="height: 120px;"></div>
            <div class="skeleton" style="height: 120px;"></div>
        `;
    },

    renderFilterPanel() {
        return `
            <div class="skeleton" style="height: 150px;"></div>
        `;
    },

    renderTasksLoading() {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${Array(6).fill(0).map(() => '<div class="skeleton" style="height: 200px;"></div>').join('')}
            </div>
        `;
    },

    async mount() {
        Navbar.mount();
        
        // Load initial data
        await this.loadCategories();
        await this.loadTasks();
        
        // Render filter panel with categories
        document.getElementById('filterPanel').innerHTML = FilterPanel.render(this.categories);
        FilterPanel.attachEventListeners((filters) => this.handleFilterChange(filters));
        
        // Attach event listeners
        this.attachEventListeners();
    },

    async loadCategories() {
        try {
            this.categories = await API.categories.getAll();
        } catch (error) {
            Toast.error('Failed to load categories');
            console.error(error);
            this.categories = [];
        }
    },

    async loadTasks() {
        try {
            const filters = FilterPanel.getFilters();
            
            if (Object.keys(filters).length > 0) {
                this.tasks = await API.tasks.filter(filters);
            } else {
                this.tasks = await API.tasks.getAll();
            }
            
            this.filteredTasks = this.tasks;
            this.renderTasks();
            this.renderStatsCards();
        } catch (error) {
            Toast.error('Failed to load tasks');
            console.error(error);
            this.tasks = [];
            this.renderTasks();
        }
    },

    renderStatsCards() {
        const todoCount = this.tasks.filter(t => t.status === TaskStatus.TODO).length;
        const doingCount = this.tasks.filter(t => t.status === TaskStatus.DOING).length;
        const doneCount = this.tasks.filter(t => t.status === TaskStatus.DONE).length;
        const totalCount = this.tasks.length;

        const stats = [
            { label: 'Total Tasks', value: totalCount, color: 'var(--primary)', icon: '📋' },
            { label: 'To Do', value: todoCount, color: '#1976d2', icon: '○' },
            { label: 'In Progress', value: doingCount, color: '#f57c00', icon: '⟳' },
            { label: 'Completed', value: doneCount, color: 'var(--success)', icon: '✓' }
        ];

        const statsHTML = stats.map(stat => `
            <div class="card" style="text-align: center; padding: 2rem 1.5rem;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${stat.icon}</div>
                <div style="font-size: 2.5rem; font-weight: 700; color: ${stat.color}; margin-bottom: 0.5rem;">
                    ${stat.value}
                </div>
                <div style="color: var(--text-secondary); font-weight: 500; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${stat.label}
                </div>
            </div>
        `).join('');

        document.getElementById('statsContainer').innerHTML = statsHTML;
    },

    renderTasks() {
        const tasksContainer = document.getElementById('tasksContainer');
        const taskCount = document.getElementById('taskCount');
        
        if (taskCount) {
            taskCount.textContent = `(${this.filteredTasks.length})`;
        }

        if (this.filteredTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="card" style="text-align: center; padding: 4rem 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;">📝</div>
                    <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">No tasks found</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                        ${this.tasks.length === 0 ? 'Create your first task to get started' : 'Try adjusting your filters'}
                    </p>
                    ${this.tasks.length === 0 ? `
                        <button onclick="TaskModal.open()" class="btn btn-primary">
                            + Create Your First Task
                        </button>
                    ` : ''}
                </div>
            `;
            return;
        }

        const tasksHTML = this.filteredTasks.map(task => {
            const category = this.categories.find(c => c.category_id === task.category_id);
            return TaskCard.render(task, category);
        }).join('');

        tasksContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${tasksHTML}
            </div>
        `;

        TaskCard.attachEventListeners();
    },

    handleFilterChange(filters) {
        this.loadTasks();
    },

    attachEventListeners() {
        const createTaskBtn = document.getElementById('createTaskBtn');
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', () => TaskModal.open());
        }
    }
};

// Make it available globally for TaskCard and TaskModal callbacks
window.currentPage = DashboardPage;
