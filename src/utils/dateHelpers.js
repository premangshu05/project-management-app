import { format, formatDistance, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateShort = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd');
};

export const getRelativeTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
};

export const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    return differenceInDays(end, start);
};

export const isOverdue = (endDate) => {
    if (!endDate) return false;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    return end < new Date();
};

export const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    const days = differenceInDays(end, new Date());
    return days;
};
