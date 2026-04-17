export const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

export const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
};