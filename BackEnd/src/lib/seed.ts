import prisma from "./prisma";

async function main() {
  await prisma.special_days.createMany({
    data: [
      {
        pattern_type: "fixed_annual",
        month: 7,
        day: 4,
        description: "Independence Day",
        is_active: true,
      },
      {
        pattern_type: "weekly",
        weekday: 5, // Friday
        description: "Friday Rush",
        is_active: true,
      },
      {
        pattern_type: "weekly",
        weekday: 6, // Saturday
        description: "Saturday Rush",
        is_active: true,
      },
    ],
  });

  await prisma.special_days.createMany({
    data: [
      {
        exact_date: new Date("2026-07-04"),
        pattern_type: "exact_date",
        description: "Independence Day",
        holding_fee_amount: 10,
        is_active: true,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
