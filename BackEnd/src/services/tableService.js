import prisma from '../lib/prisma.js';

export const getAvailableTablesForReservation = async (date, time, numberOfGuests) => {
    const allTables = await prisma.restaurant_tables.findMany({
        where: {
            is_active: true
        },
        orderBy: {
            capacity: 'asc'
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
                lt: nextDay
            },
            status: {
                in: ['PENDING', 'CONFIRMED'],
            },
        },
        include: {
            reservation_tables: {
                include: {
                    restaurant_tables: true
                },
            },
        },
    });

    const reservedTableIds = new Set();

    existingReservations.forEach(reservation => {
        const resTime = String(reservation.reservation_time).split(':')[0];
        const requestTime = parseInt(time.split(':')[0]);

        if (Math.abs(parseInt(resTime) - requestTime) < 2) {
            reservation.reservation_tables.forEach(rt => {
                reservedTableIds.add(rt.table_id);
            });
        }
    });

    const freeTables = allTables.filter(table => !reservedTableIds.has(table.id));

    const directTables = freeTables.filter(table => table.capacity >= numberOfGuests);

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