// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000', // Change this to your backend URL
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/auth/login',
            REGISTER: '/api/auth/register'
        },
        USER: {
            PROFILE: '/api/users/profile'
        },
        TASKS: {
            BASE: '/api/tasks',
            FILTERED: '/api/tasks/filtered'
        },
        CATEGORIES: {
            BASE: '/api/categories'
        },
        SUBTASKS: {
            BASE: '/api/subtasks'
        },
        ATTACHMENTS: {
            BASE: '/api/attachments'
        }
    }
};

// Task Status Enum
const TaskStatus = {
    TODO: 1,
    DOING: 2,
    DONE: 3,
    getLabel: (status) => {
        const labels = {
            1: 'To Do',
            2: 'In Progress',
            3: 'Completed'
        };
        return labels[status] || 'Unknown';
    },
    getClass: (status) => {
        const classes = {
            1: 'status-todo',
            2: 'status-doing',
            3: 'status-done'
        };
        return classes[status] || '';
    }
};

// Priority Enum
const Priority = {
    PRIORITY01: 1,
    PRIORITY02: 2,
    PRIORITY03: 3,
    PRIORITY04: 4,
    PRIORITY05: 5,
    getLabel: (priority) => {
        const labels = {
            1: 'Critical',
            2: 'High',
            3: 'Medium',
            4: 'Low',
            5: 'Lowest'
        };
        return labels[priority] || 'Unknown';
    },
    getClass: (priority) => {
        return `priority-${priority}`;
    }
};
