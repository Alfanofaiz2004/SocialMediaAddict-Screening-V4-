const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  const users = [
    { name: 'Budi Santoso', svas: 18, zone: 'BERISIKO', date: new Date(Date.now() - 86400000 * 2) },
    { name: 'Siti Aminah', svas: 12, zone: 'NORMAL', date: new Date(Date.now() - 86400000 * 1) },
    { name: 'Andi Dermawan', svas: 25, zone: 'KECANDUAN_TINGGI', date: new Date() },
  ];

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { username: u.name },
      update: {},
      create: { username: u.name, createdAt: u.date },
    });

    await prisma.assessmentResult.create({
      data: {
        userId: user.id,
        respondentName: u.name,
        date: u.date,
        overallScore: `(${u.svas}/30)`,
        zone: u.zone,
        svasTotal: u.svas,
        rawInput: {
          svasScores: [Math.floor(u.svas/6), Math.floor(u.svas/6), Math.floor(u.svas/6), Math.floor(u.svas/6), Math.floor(u.svas/6), Math.floor(u.svas/6)],
          platforms: { instagram: 3, tiktok: 2 },
          sleepHours: 6,
          productivityImpact: 7,
        },
        rawResult: {
          zone: u.zone,
          detoxPercentage: Math.round((u.svas/30)*100),
          svasTotal: u.svas,
          svasCriteria: [{ label: 'Dimensi A', score: Math.floor(u.svas/6) }],
          contextScores: { totalDuration: 5, sleepHours: 6, productivityImpact: 7 },
        },
      },
    });
  }
  console.log('Seeded 3 records!');
}

seed().catch(console.error).finally(() => process.exit(0));
