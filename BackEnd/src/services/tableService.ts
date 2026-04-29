import prisma from "../lib/prisma.js";
import type {
  CreateTableRequest,
  RestaurantTable,
  TableCombination,
} from "../types.js";

export const getAvailableTablesForReservation = async (
  date: Date,
  time: string,
  numberOfGuests: number,
) => {
  const allTables = await prisma.restaurant_tables.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      capacity: "asc",
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
        in: ["PENDING", "CONFIRMED"],
      },
    },
    include: {
      reservation_tables: true,
    },
  });

  const reservedTableIds = new Set<string>();

  const normalizedRequestTime = normalizeToHHMMSS(time);

  existingReservations.forEach((reservation) => {
    const dbTime = normalizeToHHMMSS(reservation.reservation_time);

    if (dbTime === normalizedRequestTime) {
      reservation.reservation_tables.forEach((reservationTable) => {
        reservedTableIds.add(reservationTable.table_id);
      });
    }
  });

  const freeTables = allTables.filter(
    (table) => !reservedTableIds.has(table.id),
  );

  const directTables = freeTables.filter(
    (table) => table.capacity >= numberOfGuests,
  );

  const combinations = findTableCombinations(freeTables, numberOfGuests);

  return {
    availableTables: directTables,
    suggestedCombinations: combinations,
  };
};

function normalizeToHHMMSS(timeValue: string | Date): string {
  const raw = String(timeValue);
  const match = raw.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);

  if (!match) {
    throw new Error(`Invalid time value: ${timeValue}`);
  }

  const hh = match[1].padStart(2, "0");
  const mm = match[2];
  const ss = match[3] ? match[3] : "00";

  return `${hh}:${mm}:${ss}`;
}

function findTableCombinations(
  tables: any[],
  numberOfGuests: number,
): TableCombination[] {
  const combinations: TableCombination[] = [];

  const sortedTables = [...tables].sort((a, b) => a.capacity - b.capacity);

  sortedTables.forEach((table) => {
    if (table.capacity === numberOfGuests) {
      combinations.push({
        tables: [table],
        totalCapacity: table.capacity,
        needsCombination: false,
      });
    }
  });

  if (combinations.length === 0) {
    const singleTableMatch = sortedTables.find(
      (table) => table.capacity >= numberOfGuests,
    );

    if (singleTableMatch) {
      combinations.push({
        tables: [singleTableMatch],
        totalCapacity: singleTableMatch.capacity,
        needsCombination: false,
      });
    }
  }

  for (let i = 0; i < sortedTables.length; i++) {
    for (let j = i + 1; j < sortedTables.length; j++) {
      const firstTable = sortedTables[i];
      const secondTable = sortedTables[j];

      if (!firstTable || !secondTable) {
        continue;
      }

      const totalCapacity = firstTable.capacity + secondTable.capacity;

      if (
        totalCapacity >= numberOfGuests &&
        totalCapacity <= numberOfGuests + 2
      ) {
        combinations.push({
          tables: [firstTable, secondTable],
          totalCapacity,
          needsCombination: true,
        });
      }
    }
  }

  const uniqueCombinations: TableCombination[] = [];
  const seen = new Set<string>();

  for (const combo of combinations) {
    const key = combo.tables
      .map((table) => table.id)
      .sort()
      .join("-");

    if (!seen.has(key)) {
      seen.add(key);
      uniqueCombinations.push(combo);
    }
  }

  uniqueCombinations.sort((a, b) => {
    if (a.tables.length !== b.tables.length) {
      return a.tables.length - b.tables.length;
    }

    return a.totalCapacity - b.totalCapacity;
  });

  return uniqueCombinations.slice(0, 5);
}

export const getAllTables = async () => {
  return prisma.restaurant_tables.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      capacity: "asc",
    },
  });
};

export const getTableById = async (tableId: string) => {
  return prisma.restaurant_tables.findUnique({
    where: {
      id: tableId,
    },
  });
};

export const createTable = async (tableData: CreateTableRequest) => {
  const { tableNumber, capacity } = tableData;

  const existingTable = await prisma.restaurant_tables.findUnique({
    where: {
      table_number: `${tableNumber}`,
    },
  });

  if (existingTable) {
    throw new Error("Table with this number already exists");
  }

  return prisma.restaurant_tables.create({
    data: {
      table_number: tableNumber,
      capacity,
    },
  });
};
