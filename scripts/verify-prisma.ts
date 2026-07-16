import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ Connected. Found ${userCount} users.`);
  } catch (error) {
    console.error('Failed to connect:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
