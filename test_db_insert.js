const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const respondentName = 'TestUser';
  
  const user = await prisma.user.upsert({
    where: { username: respondentName },
    update: {},
    create: { username: respondentName },
  });

  console.log('User upserted:', user);
  
  const newResult = await prisma.assessmentResult.create({
    data: {
      userId: user.id,
      respondentName: respondentName,
      overallScore: `(20/30)`,
      zone: 'BERISIKO',
      svasTotal: 20,
      rawInput: {},
      rawResult: {},
    },
  });

  console.log('Result created:', newResult);
}

run().catch(console.error).finally(() => process.exit(0));
