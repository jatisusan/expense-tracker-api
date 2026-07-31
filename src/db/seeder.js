import prisma from "../db/prisma.js";
import bcrypt from "bcrypt";
import { user, categories, wallets, incomes, expenses } from "./seederData.js";

async function main() {
  console.log("🌱 Seeding database...");

  // -----------------------------
  // Clean database
  // -----------------------------
  await prisma.expense.deleteMany();
  await prisma.income.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // -----------------------------
  // Create user
  // -----------------------------
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const createdUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
    },
  });

  console.log("✅ User created");

  // -----------------------------
  // Create categories
  // -----------------------------
  const createdCategories = [];

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: {
        ...category,
        userId: createdUser.id,
      },
    });

    createdCategories.push(createdCategory);
  }

  console.log("✅ Categories created");

  // -----------------------------
  // Create wallets
  // -----------------------------
  const createdWallets = [];

  for (const wallet of wallets) {
    const createdWallet = await prisma.wallet.create({
      data: {
        ...wallet,
        userId: createdUser.id,
      },
    });

    createdWallets.push(createdWallet);
  }

  console.log("✅ Wallets created");

  // -----------------------------
  // Create lookup maps
  // -----------------------------
  const categoryMap = {};

  for (const category of createdCategories) {
    categoryMap[category.name] = category.id;
  }

  const walletMap = {};

  for (const wallet of createdWallets) {
    walletMap[wallet.name] = wallet.id;
  }

  // -----------------------------
  // Seed incomes
  // -----------------------------
  for (const income of incomes) {
    await prisma.$transaction(async (tx) => {
      const walletId = walletMap[income.wallet];
      const categoryId = categoryMap[income.category];

      await tx.income.create({
        data: {
          title: income.title,
          amount: income.amount,
          date: new Date(income.date),
          description: income.description,
          userId: createdUser.id,
          walletId,
          categoryId,
        },
      });

      await tx.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: {
            increment: income.amount,
          },
        },
      });
    });
  }

  console.log("✅ Incomes created");

  // -----------------------------
  // Seed expenses
  // -----------------------------
  for (const expense of expenses) {
    await prisma.$transaction(async (tx) => {
      const walletId = walletMap[expense.wallet];
      const categoryId = categoryMap[expense.category];

      await tx.expense.create({
        data: {
          title: expense.title,
          amount: expense.amount,
          date: new Date(expense.date),
          description: expense.description,
          userId: createdUser.id,
          walletId,
          categoryId,
        },
      });

      await tx.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: {
            decrement: expense.amount,
          },
        },
      });
    });
  }

  console.log("✅ Expenses created");

  // -----------------------------
  // Display final wallet balances
  // -----------------------------
  const finalWallets = await prisma.wallet.findMany({
    select: {
      name: true,
      balance: true,
    },
  });

  console.log("\n💰 Final Wallet Balances");
  console.table(finalWallets);

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
