export const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

export const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
};

const normalizeTime = (time) => {
    if (!time) throw new Error('Time is required');

    const parts = time.split(':');

    if (parts.length < 2) {
        throw new Error('Invalid time format');
    }

    let hour = parseInt(parts[0], 10);
    let minute = parseInt(parts[1], 10);

    if (isNaN(hour) || isNaN(minute)) {
        throw new Error('Invalid time values');
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};