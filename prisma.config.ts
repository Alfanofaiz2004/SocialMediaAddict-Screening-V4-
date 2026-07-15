import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  earlyAccess: true,
  studio: {
    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || "",
  },
  migrations: {
    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || "",
  },
});
