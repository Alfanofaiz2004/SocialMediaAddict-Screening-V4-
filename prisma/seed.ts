import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  
  const user1 = await prisma.user.upsert({
    where: { Username: 'test_user_1' },
    update: {},
    create: {
      Username: 'test_user_1',
    },
  });

  const result1 = await prisma.assessmentResult.upsert({
    where: { UserID: 'test-uuid-1' },
    update: {},
    create: {
      UserID: 'test-uuid-1',
      Username: user1.Username,
      zone: 'KECANDUAN',
      svasTotal: 25,
      q1_salience: 4,
      q2_mood: 5,
      q3_tolerance: 4,
      q4_withdrawal: 4,
      q5_conflict: 4,
      q6_relapse: 4,
      socialMediaHours: 6.5,
      sleepHours: 5.5,
      productivityImpact: 8,
      instagramHours: 2.5,
      tiktokHours: 3.0,
      youtubeHours: 1.0,
      twitterHours: 0.0,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
