const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const input = {
  svasScores: [1, 2, 3, 4, 5, 5],
  platforms: { instagram: 2, tiktok: 2, youtube: 1, twitter: 0 },
  sleepHours: 6,
  productivityImpact: 8,
};
const result = {
  zone: 'BERISIKO',
  detoxPercentage: 50,
  svasTotal: 20,
  svasCriteria: [{ label: 'test', score: 3 }],
  contextScores: { totalDuration: 5, sleepHours: 6, productivityImpact: 8 }
};

prisma.assessmentResult.create({
  data: {
    respondentName: 'Test',
    overallScore: `(20/30)`,
    zone: 'BERISIKO',
    svasTotal: 20,
    rawInput: input,
    rawResult: result,
  },
})
  .then(res => console.log('Created:', res.id))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
