// Test data seeder for E2E tests
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test database...');

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.emailSequenceStep.deleteMany();
  await prisma.emailSequence.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.prospect.deleteMany();
  await prisma.iCP.deleteMany();
  await prisma.user.deleteMany();

  // Create test user for E2E tests
  const hashedPassword = await bcrypt.hash('Test123!@#', 10);
  const testUser = await prisma.user.create({
    data: {
      email: 'e2e@test.com',
      password: hashedPassword,
      firstName: 'E2E',
      lastName: 'Test',
      role: 'CLIENT',
      plan: 'PRO',
      dataRegion: 'US',
      language: 'en',
      isEmailVerified: true,
      companyName: 'E2E Test Company',
      timezone: 'America/New_York'
    }
  });

  console.log('✅ Created test user:', testUser.email);

  // Create test ICPs
  const icp1 = await prisma.iCP.create({
    data: {
      userId: testUser.id,
      name: 'Enterprise SaaS',
      description: 'Large software companies',
      criteria: {
        industry: ['Technology', 'Software'],
        companySize: ['large', 'enterprise'],
        location: ['United States', 'Canada'],
        keywords: ['SaaS', 'B2B', 'Cloud'],
        revenue: '50m_100m'
      },
      isActive: true
    }
  });

  const icp2 = await prisma.iCP.create({
    data: {
      userId: testUser.id,
      name: 'Tech Startups',
      description: 'Early-stage technology companies',
      criteria: {
        industry: ['Technology', 'AI', 'FinTech'],
        companySize: ['startup', 'small'],
        location: ['United States'],
        keywords: ['Innovation', 'Growth', 'Disruption'],
        revenue: 'under_1m'
      },
      isActive: true
    }
  });

  console.log('✅ Created ICPs:', icp1.name, icp2.name);

  // Create test prospects
  const prospects = [
    {
      userId: testUser.id,
      icpId: icp1.id,
      email: 'ceo@techcorp.com',
      firstName: 'Alice',
      lastName: 'Johnson',
      jobTitle: 'CEO',
      company: {
        name: 'TechCorp Solutions',
        domain: 'techcorp.com',
        industry: 'Technology',
        size: 'enterprise',
        location: 'San Francisco, CA',
        employees: 5000,
        revenue: '100m+'
      },
      score: 0,
      stage: 'new',
      source: 'manual',
      isOptedOut: false
    },
    {
      userId: testUser.id,
      icpId: icp1.id,
      email: 'cto@innovate.io',
      firstName: 'Bob',
      lastName: 'Smith',
      jobTitle: 'CTO',
      company: {
        name: 'Innovate.io',
        domain: 'innovate.io',
        industry: 'Software',
        size: 'large',
        location: 'New York, NY',
        employees: 1000,
        revenue: '50m-100m'
      },
      score: 75,
      scoreExplanation: {
        total: 75,
        breakdown: {
          budget: 80,
          authority: 90,
          need: 70,
          timing: 60,
          signals: 75
        },
        reasoning: {
          budget: 'Large company with significant IT budget',
          authority: 'CTO is key decision maker',
          need: 'Growing company likely needs solution',
          timing: 'No immediate project identified',
          signals: 'Active in technology adoption'
        },
        confidence: 0.85
      },
      stage: 'contacted',
      source: 'csv_import',
      isOptedOut: false
    },
    {
      userId: testUser.id,
      icpId: icp2.id,
      email: 'founder@startup.ai',
      firstName: 'Charlie',
      lastName: 'Davis',
      jobTitle: 'Founder & CEO',
      company: {
        name: 'AI Startup Inc',
        domain: 'startup.ai',
        industry: 'Artificial Intelligence',
        size: 'startup',
        location: 'Austin, TX',
        employees: 25,
        revenue: 'under 1m',
        founded: 2022
      },
      score: 60,
      scoreExplanation: {
        total: 60,
        breakdown: {
          budget: 40,
          authority: 100,
          need: 80,
          timing: 50,
          signals: 30
        },
        reasoning: {
          budget: 'Limited budget as early-stage startup',
          authority: 'Founder has full decision authority',
          need: 'Likely needs sales automation',
          timing: 'May not be immediate priority',
          signals: 'Limited market signals'
        },
        confidence: 0.75
      },
      stage: 'meeting',
      source: 'url_scraping',
      isOptedOut: false
    }
  ];

  for (const prospectData of prospects) {
    await prisma.prospect.create({ data: prospectData });
  }

  console.log('✅ Created', prospects.length, 'test prospects');

  // Create test email sequence
  const sequence = await prisma.emailSequence.create({
    data: {
      userId: testUser.id,
      icpId: icp1.id,
      name: 'Welcome Sequence',
      description: 'Initial outreach sequence for new prospects',
      isActive: true,
      steps: {
        create: [
          {
            stepNumber: 1,
            subject: 'Quick question about {{company.name}}',
            content: 'Hi {{firstName}},\n\nI noticed {{company.name}} is growing rapidly...',
            delayDays: 0,
            isActive: true
          },
          {
            stepNumber: 2,
            subject: 'Following up',
            content: 'Hi {{firstName}},\n\nJust wanted to follow up on my previous email...',
            delayDays: 3,
            conditions: [{
              type: 'opened',
              action: 'continue'
            }],
            isActive: true
          },
          {
            stepNumber: 3,
            subject: 'Final check-in',
            content: 'Hi {{firstName}},\n\nThis will be my last email...',
            delayDays: 7,
            conditions: [{
              type: 'replied',
              action: 'stop'
            }],
            isActive: true
          }
        ]
      }
    },
    include: {
      steps: true
    }
  });

  console.log('✅ Created email sequence with', sequence.steps.length, 'steps');

  // Create test activities
  const activities = [
    {
      userId: testUser.id,
      prospectId: prospects[0].userId, // This should be the prospect ID from the created prospects
      type: 'call',
      title: 'Discovery Call',
      description: 'Initial discovery call to understand needs',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      reminder: {
        enabled: true,
        beforeMinutes: 60,
        email: true,
        push: false
      }
    },
    {
      userId: testUser.id,
      prospectId: prospects[1].userId,
      type: 'meeting',
      title: 'Product Demo',
      description: 'Live demo of Pro features',
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      reminder: {
        enabled: true,
        beforeMinutes: 120,
        email: true,
        push: true
      }
    }
  ];

  // Note: We need to get the actual prospect IDs from the database
  const createdProspects = await prisma.prospect.findMany({
    where: { userId: testUser.id }
  });

  if (createdProspects.length >= 2) {
    activities[0].prospectId = createdProspects[0].id;
    activities[1].prospectId = createdProspects[1].id;

    for (const activityData of activities) {
      await prisma.activity.create({ data: activityData });
    }
    console.log('✅ Created', activities.length, 'test activities');
  }

  console.log('🎉 Test database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
