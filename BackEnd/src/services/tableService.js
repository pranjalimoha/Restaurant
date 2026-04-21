import prisma from '../lib/prisma.js';

export const getAvailableTablesForReservation = async (date, time, numberOfGuests) => {
    const allTables = await prisma.restaurant_tables.findMany({
        where: {
            is_active: true,
        },
        orderBy: {
            capacity: 'asc',
        },
    });

    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(reservationDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingReservations = await prisma.reservations.findMany({
        where: {
            reservation_date: {
                gte: reservationDate,
                lt: nextDay,
            },
            status: {
                in: ['PENDING', 'CONFIRMED'],
            },
        },
        include: {
            reservation_tables: true,
        },
    });

    const reservedTableIds = new Set();

    // const [requestHour, requestMinute] = time.split(':').map(Number);
    // const requestTotalMinutes = requestHour * 60 + requestMinute;

    // existingReservations.forEach((reservation) => {
    //     const reservationTime = new Date(reservation.reservation_time);
    //     const reservationHour = reservationTime.getHours();
    //     const reservationMinute = reservationTime.getMinutes();
    //     const reservationTotalMinutes = reservationHour * 60 + reservationMinute;

    //     // block table if reservation is within 2 hours
    //     if (Math.abs(reservationTotalMinutes - requestTotalMinutes) < 120) {
    //         reservation.reservation_tables.forEach((rt) => {
    //             reservedTableIds.add(rt.table_id);
    //         });
    //     }
    //});
    const normalizeToHHMMSS = (timeValue) => {
        const raw = String(timeValue);
        const match = raw.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);

        if (!match) {
            throw new Error(`Invalid time value: ${timeValue}`);
        }

        const hh = match[1].padStart(2, '0');
        const mm = match[2];
        const ss = match[3] ? match[3] : '00';

        return `${hh}:${mm}:${ss}`;
    };

    const normalizedRequestTime = normalizeToHHMMSS(time);

    existingReservations.forEach((reservation) => {
        const dbTime = normalizeToHHMMSS(reservation.reservation_time);

        // block ONLY same exact time
        if (dbTime === normalizedRequestTime) {
            reservation.reservation_tables.forEach((rt) => {
                reservedTableIds.add(rt.table_id);
            });
        }
    });

    const freeTables = allTables.filter((table) => !reservedTableIds.has(table.id));

    const directTables = freeTables.filter((table) => table.capacity >= numberOfGuests);

    const combinations = findTableCombinations(freeTables, numberOfGuests);

    return {
        availableTables: directTables,
        suggestedCombinations: combinations,
    };
};
function findTableCombinations(tables, numberOfGuests) {
    const combinations = [];

    // Sort tables by capacity first
    const sortedTables = [...tables].sort((a, b) => a.capacity - b.capacity);

    // Add all exact single-table matches first
    sortedTables.forEach((table) => {
        if (table.capacity === numberOfGuests) {
            combinations.push({
                tables: [table],
                totalCapacity: table.capacity,
                needsCombination: false,
            });
        }
    });

    // If no exact single match, add the smallest single table that fits
    if (combinations.length === 0) {
        const singleTableMatch = sortedTables.find(t => t.capacity >= numberOfGuests);

        if (singleTableMatch) {
            combinations.push({
                tables: [singleTableMatch],
                totalCapacity: singleTableMatch.capacity,
                needsCombination: false,
            });
        }
    }

    // Add 2-table combinations
    for (let i = 0; i < sortedTables.length; i++) {
        for (let j = i + 1; j < sortedTables.length; j++) {
            const totalCapacity = sortedTables[i].capacity + sortedTables[j].capacity;

            if (
                totalCapacity >= numberOfGuests &&
                totalCapacity <= numberOfGuests + 2
            ) {
                combinations.push({
                    tables: [sortedTables[i], sortedTables[j]],
                    totalCapacity,
                    needsCombination: true,
                });
            }
        }
    }

    // Remove duplicates
    const uniqueCombinations = [];
    const seen = new Set();

    for (const combo of combinations) {
        const key = combo.tables.map(t => t.id).sort().join('-');
        if (!seen.has(key)) {
            seen.add(key);
            uniqueCombinations.push(combo);
        }
    }

    // Sort by:
    // 1. fewer tables first
    // 2. lower total capacity first
    uniqueCombinations.sort((a, b) => {
        if (a.tables.length !== b.tables.length) {
            return a.tables.length - b.tables.length;
        }
        return a.totalCapacity - b.totalCapacity;
    });

    return uniqueCombinations.slice(0, 5);
}

export const getAllTables = async () => {
    const tables = await prisma.restaurant_tables.findMany({
        where: { is_active: true },
        orderBy: { capacity: 'asc' },
    });
    return tables;
};

export const getTableById = async (tableId) => {
    const table = await prisma.restaurant_tables.findUnique({
        where: { id: tableId },
    });
    return table;
};

export const createTable = async (tableData) => {
    const { tableNumber, capacity } = tableData;

    const existingTable = await prisma.restaurant_tables.findUnique({
        where: { table_number: tableNumber },
    });

    if (existingTable) {
        throw new Error('Table with this number already exists');
    }

    const table = await prisma.restaurant_tables.create({
        data: {
            table_number: tableNumber,
            capacity,
        },
    });

    return table;
};