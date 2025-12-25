// Task Card Component
const TaskCard = {
    render(task, category) {
        const statusClass = TaskStatus.getClass(task.status);
        const statusLabel = TaskStatus.getLabel(task.status);
        const priorityClass = Priority.getClass(task.priority);
        const priorityLabel = Priority.getLabel(task.priority);
        
        const dueDate = new Date(task.due_date);
        const isOverdue = dueDate < new Date() && task.status !== TaskStatus.DONE;
        const dueDateStr = dueDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });

        return `
            <div class="card task-card" data-task-id="${task.task_id}" style="cursor: pointer; position: relative; overflow: hidden;">
                ${category ? `
                    <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: ${category.color};"></div>
                ` : ''}
                
                <div style="padding-left: ${category ? '0.5rem' : '0'};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                        <div style="flex: 1;">
                            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                                ${task.name}
                            </h3>
                            ${task.description ? `
                                <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5; margin-bottom: 0.75rem;">
                                    ${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}
                                </p>
                            ` : ''}
                        </div>
                        
                        <div style="display: flex; gap: 0.5rem; margin-left: 1rem;">
                            <button class="status-btn" data-task-id="${task.task_id}" title="Change Status" 
                                style="background: none; border: none; cursor: pointer; font-size: 1.25rem; opacity: 0.6; transition: opacity 0.3s;">
                                ${task.status === TaskStatus.DONE ? '✓' : task.status === TaskStatus.DOING ? '⟳' : '○'}
                            </button>
                        </div>
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                        <span class="badge ${statusClass}">${statusLabel}</span>
                        <span class="badge ${priorityClass}">${priorityLabel}</span>
                        ${category ? `
                            <span class="badge" style="background: ${category.color}22; color: ${category.color}; border: 1px solid ${category.color};">
                                ${category.name}
                            </span>
                        ` : ''}
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--border);">
                        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: ${isOverdue ? 'var(--highlight)' : 'var(--text-secondary)'}; font-weight: ${isOverdue ? '600' : '400'};">
                            <span>📅</span>
                            <span>${dueDateStr}</span>
                            ${isOverdue ? '<span style="font-size: 0.75rem;">(Overdue)</span>' : ''}
                        </div>
                        
                        <button class="delete-btn" data-task-id="${task.task_id}" 
                            style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 4px; transition: all 0.3s;"
                            title="Delete Task">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    attachEventListeners() {
        // Click on card to open modal
        document.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignore if clicking on action buttons
                if (e.target.closest('.status-btn') || e.target.closest('.delete-btn')) {
                    return;
                }
                const taskId = card.dataset.taskId;
                TaskModal.open(taskId);
            });
        });

        // Status change buttons
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const taskId = btn.dataset.taskId;
                await this.cycleStatus(taskId);
            });

            // Hover effect
            btn.addEventListener('mouseenter', () => {
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1.2)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.opacity = '0.6';
                btn.style.transform = 'scale(1)';
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const taskId = btn.dataset.taskId;
                await this.deleteTask(taskId);
            });

            // Hover effect
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#fee';
                btn.style.color = 'var(--highlight)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'none';
                btn.style.color = 'var(--text-secondary)';
            });
        });
    },

    async cycleStatus(taskId) {
        try {
            const task = await API.tasks.getOne(taskId);
            let newStatus;
            
            if (task.status === TaskStatus.TODO) {
                newStatus = TaskStatus.DOING;
            } else if (task.status === TaskStatus.DOING) {
                newStatus = TaskStatus.DONE;
            } else {
                newStatus = TaskStatus.TODO;
            }

            await API.tasks.update(taskId, { ...task, status: newStatus });
            Toast.success(`Task status updated to ${TaskStatus.getLabel(newStatus)}`);
            
            // Reload tasks
            if (window.currentPage && window.currentPage.loadTasks) {
                window.currentPage.loadTasks();
            }
        } catch (error) {
            Toast.error('Failed to update task status');
            console.error(error);
        }
    },

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await API.tasks.delete(taskId);
            Toast.success('Task deleted successfully');
            
            // Reload tasks
            if (window.currentPage && window.currentPage.loadTasks) {
                window.currentPage.loadTasks();
            }
        } catch (error) {
            Toast.error('Failed to delete task');
            console.error(error);
        }
    }
};
