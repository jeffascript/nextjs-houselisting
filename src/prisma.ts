import { PrismaClient } from "@prisma/client"; //created due to the yarn db:generate, specifically for our db

const prisma = new PrismaClient({
  // log: process.env.NODE_ENV === "development" ? ["query", "info", "warn"]: []
  log: ["query", "info", "warn"],
});

export { prisma, PrismaClient };
