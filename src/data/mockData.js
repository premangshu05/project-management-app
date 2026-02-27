// Mock data for ProzexiS application

export const teamMembers = [
    {
        id: 1,
        name: 'Sarah Chen',
        role: 'Full Stack Developer',
        avatar: 'https://i.pravatar.cc/150?img=1',
        email: 'sarah.chen@prozexis.com'
    },
    {
        id: 2,
        name: 'Marcus Johnson',
        role: 'Frontend Developer',
        avatar: 'https://i.pravatar.cc/150?img=12',
        email: 'marcus.j@prozexis.com'
    },
    {
        id: 3,
        name: 'Priya Patel',
        role: 'Backend Developer',
        avatar: 'https://i.pravatar.cc/150?img=5',
        email: 'priya.p@prozexis.com'
    },
    {
        id: 4,
        name: 'Alex Rivera',
        role: 'UI/UX Designer',
        avatar: 'https://i.pravatar.cc/150?img=8',
        email: 'alex.r@prozexis.com'
    },
    {
        id: 5,
        name: 'Emma Wilson',
        role: 'DevOps Engineer',
        avatar: 'https://i.pravatar.cc/150?img=9',
        email: 'emma.w@prozexis.com'
    },
    {
        id: 6,
        name: 'David Kim',
        role: 'QA Engineer',
        avatar: 'https://i.pravatar.cc/150?img=14',
        email: 'david.k@prozexis.com'
    }
];

export const projects = [
    {
        id: 1,
        name: 'E-Commerce Platform Redesign',
        description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX and improved performance',
        startDate: '2026-01-15',
        endDate: '2026-04-30',
        priority: 'High',
        category: 'Full Stack',
        status: 'In Progress',
        assignedTeam: [1, 2, 4],
        tasks: [
            {
                id: 1,
                name: 'Design System Setup',
                assignedTo: [4],
                subtasks: [
                    { id: 1, name: 'Create color palette', completed: true },
                    { id: 2, name: 'Define typography scale', completed: true },
                    { id: 3, name: 'Build component library', completed: false }
                ]
            },
            {
                id: 2,
                name: 'Frontend Development',
                assignedTo: [2],
                subtasks: [
                    { id: 1, name: 'Setup React project', completed: true },
                    { id: 2, name: 'Implement product listing', completed: true },
                    { id: 3, name: 'Build shopping cart', completed: false },
                    { id: 4, name: 'Create checkout flow', completed: false }
                ]
            },
            {
                id: 3,
                name: 'Backend API Development',
                assignedTo: [1, 3],
                subtasks: [
                    { id: 1, name: 'Design database schema', completed: true },
                    { id: 2, name: 'Implement authentication', completed: false },
                    { id: 3, name: 'Create product endpoints', completed: false }
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Mobile App Development',
        description: 'Native mobile application for iOS and Android with offline capabilities',
        startDate: '2026-02-01',
        endDate: '2026-06-15',
        priority: 'Critical',
        category: 'Frontend',
        status: 'Planning',
        assignedTeam: [2, 4],
        tasks: [
            {
                id: 1,
                name: 'Requirements Gathering',
                assignedTo: [4],
                subtasks: [
                    { id: 1, name: 'User research', completed: true },
                    { id: 2, name: 'Feature prioritization', completed: false },
                    { id: 3, name: 'Technical feasibility study', completed: false }
                ]
            },
            {
                id: 2,
                name: 'UI/UX Design',
                assignedTo: [4],
                subtasks: [
                    { id: 1, name: 'Wireframes', completed: false },
                    { id: 2, name: 'High-fidelity mockups', completed: false },
                    { id: 3, name: 'Prototype', completed: false }
                ]
            }
        ]
    },
    {
        id: 3,
        name: 'DevOps Pipeline Setup',
        description: 'Automated CI/CD pipeline with containerization and monitoring',
        startDate: '2026-01-20',
        endDate: '2026-03-15',
        priority: 'Medium',
        category: 'DevOps',
        status: 'Review',
        assignedTeam: [5, 6],
        tasks: [
            {
                id: 1,
                name: 'Docker Configuration',
                assignedTo: [5],
                subtasks: [
                    { id: 1, name: 'Create Dockerfiles', completed: true },
                    { id: 2, name: 'Setup docker-compose', completed: true },
                    { id: 3, name: 'Optimize images', completed: true }
                ]
            },
            {
                id: 2,
                name: 'CI/CD Setup',
                assignedTo: [5],
                subtasks: [
                    { id: 1, name: 'Configure GitHub Actions', completed: true },
                    { id: 2, name: 'Setup automated testing', completed: true },
                    { id: 3, name: 'Deploy to staging', completed: false }
                ]
            }
        ]
    },
    {
        id: 4,
        name: 'API Documentation Portal',
        description: 'Interactive API documentation with live examples and sandbox environment',
        startDate: '2026-02-10',
        endDate: '2026-03-30',
        priority: 'Low',
        category: 'Backend',
        status: 'Completed',
        assignedTeam: [3, 2],
        tasks: [
            {
                id: 1,
                name: 'Documentation Writing',
                assignedTo: [3],
                subtasks: [
                    { id: 1, name: 'API endpoints documentation', completed: true },
                    { id: 2, name: 'Authentication guide', completed: true },
                    { id: 3, name: 'Code examples', completed: true }
                ]
            },
            {
                id: 2,
                name: 'Portal Development',
                assignedTo: [2],
                subtasks: [
                    { id: 1, name: 'Setup documentation framework', completed: true },
                    { id: 2, name: 'Build interactive sandbox', completed: true },
                    { id: 3, name: 'Deploy to production', completed: true }
                ]
            }
        ]
    },
    {
        id: 5,
        name: 'Security Audit & Compliance',
        description: 'Comprehensive security audit and implementation of compliance measures',
        startDate: '2026-01-05',
        endDate: '2026-02-28',
        priority: 'Critical',
        category: 'Testing',
        status: 'On Hold',
        assignedTeam: [6, 3],
        tasks: [
            {
                id: 1,
                name: 'Security Assessment',
                assignedTo: [6],
                subtasks: [
                    { id: 1, name: 'Vulnerability scanning', completed: true },
                    { id: 2, name: 'Penetration testing', completed: false },
                    { id: 3, name: 'Code review', completed: false }
                ]
            }
        ]
    },
    {
        id: 6,
        name: 'Analytics Dashboard',
        description: 'Real-time analytics dashboard with custom metrics and reporting',
        startDate: '2026-02-15',
        endDate: '2026-05-01',
        priority: 'Medium',
        category: 'UI/UX',
        status: 'In Progress',
        assignedTeam: [2, 4, 1],
        tasks: [
            {
                id: 1,
                name: 'Data Visualization',
                assignedTo: [2, 4],
                subtasks: [
                    { id: 1, name: 'Chart library integration', completed: true },
                    { id: 2, name: 'Custom chart components', completed: true },
                    { id: 3, name: 'Interactive filters', completed: false },
                    { id: 4, name: 'Export functionality', completed: false }
                ]
            },
            {
                id: 2,
                name: 'Backend Integration',
                assignedTo: [1],
                subtasks: [
                    { id: 1, name: 'API endpoints', completed: true },
                    { id: 2, name: 'Real-time updates', completed: false }
                ]
            }
        ]
    }
];

export const notifications = [
    {
        id: 1,
        type: 'task',
        title: 'Task completed',
        message: 'Marcus completed "Implement product listing"',
        time: '5 minutes ago',
        read: false
    },
    {
        id: 2,
        type: 'deadline',
        title: 'Deadline approaching',
        message: 'E-Commerce Platform Redesign due in 3 days',
        time: '1 hour ago',
        read: false
    },
    {
        id: 3,
        type: 'mention',
        title: 'You were mentioned',
        message: 'Sarah mentioned you in a comment',
        time: '2 hours ago',
        read: true
    },
    {
        id: 4,
        type: 'assignment',
        title: 'New task assigned',
        message: 'You were assigned to "Security Assessment"',
        time: '1 day ago',
        read: true
    }
];

export const activityFeed = [
    {
        id: 1,
        user: teamMembers[1],
        action: 'completed',
        target: 'Implement product listing',
        project: 'E-Commerce Platform Redesign',
        time: '5 minutes ago'
    },
    {
        id: 2,
        user: teamMembers[4],
        action: 'deployed',
        target: 'CI/CD Pipeline',
        project: 'DevOps Pipeline Setup',
        time: '1 hour ago'
    },
    {
        id: 3,
        user: teamMembers[3],
        action: 'commented on',
        target: 'UI/UX Design',
        project: 'Mobile App Development',
        time: '2 hours ago'
    },
    {
        id: 4,
        user: teamMembers[0],
        action: 'created',
        target: 'Backend API Development',
        project: 'E-Commerce Platform Redesign',
        time: '3 hours ago'
    },
    {
        id: 5,
        user: teamMembers[2],
        action: 'updated',
        target: 'API Documentation',
        project: 'API Documentation Portal',
        time: '5 hours ago'
    }
];
