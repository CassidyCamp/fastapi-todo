// Centralized API Service
const API = {
    // Generic request handler
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...Auth.getAuthHeader(),
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                Auth.logout();
                throw new Error('Session expired. Please login again.');
            }

            // Handle errors
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || error.message || `Request failed with status ${response.status}`);
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },

    // GET request
    get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    },

    // POST request
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // PUT request
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // DELETE request
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // ==================== CATEGORIES ====================
    categories: {
        getAll() {
            return API.get(API_CONFIG.ENDPOINTS.CATEGORIES.BASE);
        }
    },

    // ==================== TASKS ====================
    tasks: {
        // Get all tasks
        getAll() {
            return API.get(API_CONFIG.ENDPOINTS.TASKS.BASE);
        },

        // Get single task
        getOne(taskId) {
            return API.get(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/${taskId}`);
        },

        // Create task
        create(taskData) {
            return API.post(API_CONFIG.ENDPOINTS.TASKS.BASE, taskData);
        },

        // Update task
        update(taskId, taskData) {
            return API.put(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/${taskId}`, taskData);
        },

        // Delete task
        delete(taskId) {
            return API.delete(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/${taskId}`);
        },

        // Filter tasks
        filter(filters) {
            return API.get(API_CONFIG.ENDPOINTS.TASKS.FILTERED, filters);
        }
    },

    // ==================== SUBTASKS ====================
    subtasks: {
        // Get subtasks for a task
        getByTask(taskId) {
            return API.get(`${API_CONFIG.ENDPOINTS.SUBTASKS.BASE}?task_id=${taskId}`);
        },

        // Create subtask
        create(subtaskData) {
            return API.post(API_CONFIG.ENDPOINTS.SUBTASKS.BASE, subtaskData);
        },

        // Update subtask
        update(subtaskId, subtaskData) {
            return API.put(`${API_CONFIG.ENDPOINTS.SUBTASKS.BASE}/${subtaskId}`, subtaskData);
        },

        // Delete subtask
        delete(subtaskId) {
            return API.delete(`${API_CONFIG.ENDPOINTS.SUBTASKS.BASE}/${subtaskId}`);
        }
    },

    // ==================== ATTACHMENTS ====================
    attachments: {
        // Get attachments for a task
        getByTask(taskId) {
            return API.get(`${API_CONFIG.ENDPOINTS.ATTACHMENTS.BASE}?task_id=${taskId}`);
        },

        // Create attachment
        create(attachmentData) {
            return API.post(API_CONFIG.ENDPOINTS.ATTACHMENTS.BASE, attachmentData);
        },

        // Delete attachment
        delete(attachmentId) {
            return API.delete(`${API_CONFIG.ENDPOINTS.ATTACHMENTS.BASE}/${attachmentId}`);
        }
    }
};
