// Filter Panel Component
const FilterPanel = {
    currentFilters: {},
    
    render(categories) {
        return `
            <div class="card" style="margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.25rem; font-weight: 600;">Filters</h3>
                    <button id="clearFilters" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                        Clear All
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                            Status
                        </label>
                        <select id="filterStatus" class="input-field" style="padding: 0.625rem 0.75rem;">
                            <option value="">All Statuses</option>
                            <option value="${TaskStatus.TODO}">To Do</option>
                            <option value="${TaskStatus.DOING}">In Progress</option>
                            <option value="${TaskStatus.DONE}">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                            Priority
                        </label>
                        <select id="filterPriority" class="input-field" style="padding: 0.625rem 0.75rem;">
                            <option value="">All Priorities</option>
                            <option value="${Priority.PRIORITY01}">Critical</option>
                            <option value="${Priority.PRIORITY02}">High</option>
                            <option value="${Priority.PRIORITY03}">Medium</option>
                            <option value="${Priority.PRIORITY04}">Low</option>
                            <option value="${Priority.PRIORITY05}">Lowest</option>
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                            Category
                        </label>
                        <select id="filterCategory" class="input-field" style="padding: 0.625rem 0.75rem;">
                            <option value="">All Categories</option>
                            ${categories.map(cat => `
                                <option value="${cat.category_id}">
                                    ${cat.icon || ''} ${cat.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                            Due Date
                        </label>
                        <input type="date" id="filterDueDate" class="input-field" style="padding: 0.625rem 0.75rem;">
                    </div>
                </div>

                ${this.renderActiveFilters()}
            </div>
        `;
    },

    renderActiveFilters() {
        const activeCount = Object.keys(this.currentFilters).filter(key => this.currentFilters[key]).length;
        
        if (activeCount === 0) return '';

        return `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                    Active Filters: ${activeCount}
                </div>
            </div>
        `;
    },

    attachEventListeners(onFilterChange) {
        // Filter change listeners
        ['filterStatus', 'filterPriority', 'filterCategory', 'filterDueDate'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.updateFilters();
                    onFilterChange(this.currentFilters);
                });
            }
        });

        // Clear filters button
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
                onFilterChange(this.currentFilters);
            });
        }
    },

    updateFilters() {
        this.currentFilters = {
            status: document.getElementById('filterStatus')?.value || '',
            priority: document.getElementById('filterPriority')?.value || '',
            category_id: document.getElementById('filterCategory')?.value || '',
            due_date: document.getElementById('filterDueDate')?.value || ''
        };

        // Remove empty filters
        Object.keys(this.currentFilters).forEach(key => {
            if (!this.currentFilters[key]) {
                delete this.currentFilters[key];
            }
        });
    },

    clearFilters() {
        ['filterStatus', 'filterPriority', 'filterCategory', 'filterDueDate'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });
        this.currentFilters = {};
    },

    getFilters() {
        return this.currentFilters;
    }
};
