// Smart progress calculation utilities

export const calculateTaskProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;

    const completedCount = subtasks.filter(st => st.completed).length;
    return Math.round((completedCount / subtasks.length) * 100);
};

export const calculateProjectProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;

    const totalProgress = tasks.reduce((sum, task) => {
        return sum + calculateTaskProgress(task.subtasks);
    }, 0);

    return Math.round(totalProgress / tasks.length);
};

export const getProgressColor = (progress) => {
    if (progress === 100) return '#10b981'; // green
    if (progress >= 75) return '#3b82f6'; // blue
    if (progress >= 50) return '#f59e0b'; // yellow
    if (progress >= 25) return '#f97316'; // orange
    return '#ef4444'; // red
};

export const getProgressStatus = (progress) => {
    if (progress === 100) return 'Completed';
    if (progress >= 75) return 'Near Completion';
    if (progress >= 50) return 'On Track';
    if (progress >= 25) return 'In Progress';
    return 'Just Started';
};

