// Task Modal Component
const TaskModal = {
    currentTaskId: null,

    async open(taskId = null) {
        this.currentTaskId = taskId;
        
        if (taskId) {
            await this.renderEditMode(taskId);
        } else {
            this.renderCreateMode();
        }
    },

    async renderEditMode(taskId) {
        try {
            const task = await API.tasks.getOne(taskId);
            const categories = await API.categories.getAll();
            
            const modal = this.createModal('Edit Task', this.getFormHTML(task, categories, true));
            document.body.appendChild(modal);
            this.attachEventListeners(true);
        } catch (error) {
            Toast.error('Failed to load task details');
            console.error(error);
        }
    },

    renderCreateMode() {
        API.categories.getAll().then(categories => {
            const modal = this.createModal('Create New Task', this.getFormHTML(null, categories, false));
            document.body.appendChild(modal);
            this.attachEventListeners(false);
        }).catch(error => {
            Toast.error('Failed to load categories');
            console.error(error);
        });
    },

    createModal(title, content) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <div style="padding: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h2 style="font-size: 1.75rem; font-weight: 700;">${title}</h2>
                        <button id="closeModal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: all 0.3s;">
                            ×
                        </button>
                    </div>
                    ${content}
                </div>
            </div>
        `;

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
            }
        });

        return overlay;
    },

    getFormHTML(task, categories, isEdit) {
        const task_name = task?.name || '';
        const task_description = task?.description || '';
        const task_due_date = task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '';
        const task_status = task?.status || TaskStatus.TODO;
        const task_priority = task?.priority || Priority.PRIORITY03;
        const task_category = task?.category_id || '';

        return `
            <form id="taskForm" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                        Task Name *
                    </label>
                    <input type="text" name="name" class="input-field" value="${task_name}" required placeholder="Enter task name">
                </div>

                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                        Description
                    </label>
                    <textarea name="description" class="input-field" rows="4" placeholder="Enter task description">${task_description}</textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                            Due Date *
                        </label>
                        <input type="datetime-local" name="due_date" class="input-field" value="${task_due_date}" required>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                            Category
                        </label>
                        <select name="category_id" class="input-field">
                            <option value="">No Category</option>
                            ${categories.map(cat => `
                                <option value="${cat.category_id}" ${cat.category_id === task_category ? 'selected' : ''}>
                                    ${cat.name || ''}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                            Status
                        </label>
                        <select name="status" class="input-field">
                            <option value="${TaskStatus.TODO}" ${task_status === TaskStatus.TODO ? 'selected' : ''}>To Do</option>
                            <option value="${TaskStatus.DOING}" ${task_status === TaskStatus.DOING ? 'selected' : ''}>In Progress</option>
                            <option value="${TaskStatus.DONE}" ${task_status === TaskStatus.DONE ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                            Priority
                        </label>
                        <select name="priority" class="input-field">
                            <option value="${Priority.PRIORITY01}" ${task_priority === Priority.PRIORITY01 ? 'selected' : ''}>Critical</option>
                            <option value="${Priority.PRIORITY02}" ${task_priority === Priority.PRIORITY02 ? 'selected' : ''}>High</option>
                            <option value="${Priority.PRIORITY03}" ${task_priority === Priority.PRIORITY03 ? 'selected' : ''}>Medium</option>
                            <option value="${Priority.PRIORITY04}" ${task_priority === Priority.PRIORITY04 ? 'selected' : ''}>Low</option>
                            <option value="${Priority.PRIORITY05}" ${task_priority === Priority.PRIORITY05 ? 'selected' : ''}>Lowest</option>
                        </select>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                    <button type="button" id="cancelBtn" class="btn btn-outline">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        ${isEdit ? 'Update Task' : 'Create Task'}
                    </button>
                </div>
            </form>
        `;
    },

    attachEventListeners(isEdit) {
        // Close button
        document.getElementById('closeModal').addEventListener('click', () => this.close());
        document.getElementById('cancelBtn').addEventListener('click', () => this.close());

        // Close modal hover effect
        const closeBtn = document.getElementById('closeModal');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#fee';
            closeBtn.style.color = 'var(--highlight)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'none';
            closeBtn.style.color = 'var(--text-secondary)';
        });

        // Form submission
        document.getElementById('taskForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(isEdit);
        });
    },

    async handleSubmit(isEdit) {
        const form = document.getElementById('taskForm');
        const formData = new FormData(form);
        
        const taskData = {
            name: formData.get('name'),
            description: formData.get('description') || null,
            due_date: formData.get('due_date'),
            status: parseInt(formData.get('status')),
            priority: parseInt(formData.get('priority')),
            category_id: formData.get('category_id') ? parseInt(formData.get('category_id')) : null
        };

        try {
            if (isEdit) {
                await API.tasks.update(this.currentTaskId, taskData);
                Toast.success('Task updated successfully');
            } else {
                await API.tasks.create(taskData);
                Toast.success('Task created successfully');
            }

            this.close();
            
            // Reload tasks
            if (window.currentPage && window.currentPage.loadTasks) {
                window.currentPage.loadTasks();
            }
        } catch (error) {
            Toast.error(isEdit ? 'Failed to update task' : 'Failed to create task');
            console.error(error);
        }
    },

    close() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
        this.currentTaskId = null;
    }
};
