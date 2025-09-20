import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aisalesagent.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      plan: 'BUSINESS',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      language: 'en',
      dataRegion: 'US',
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create sample client user
  const clientUser = await prisma.user.upsert({
    where: { email: 'demo@aisalesagent.com' },
    update: {},
    create: {
      email: 'demo@aisalesagent.com',
      passwordHash: await bcrypt.hash('DemoPassword123!', 12),
      firstName: 'Demo',
      lastName: 'User',
      companyName: 'Demo Company Inc.',
      role: 'CLIENT',
      plan: 'STARTER',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      language: 'en',
      dataRegion: 'US',
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Demo user created:', clientUser.email);

  // Create sample ICP for demo user
  const icp = await prisma.iCP.create({
    data: {
      userId: clientUser.id,
      name: 'B2B SaaS Companies',
      description: 'Software companies targeting enterprise clients',
      criteria: {
        industry: ['Technology', 'Software'],
        companySize: ['MEDIUM', 'LARGE', 'ENTERPRISE'],
        revenue: 'TEN_TO_FIFTY_M',
        location: ['United States', 'Canada'],
        keywords: ['SaaS', 'B2B', 'Enterprise', 'Cloud'],
        jobTitles: ['VP Sales', 'Head of Sales', 'Sales Director'],
      },
    },
  });

  console.log('✅ Sample ICP created:', icp.name);

  // Create sample prospects
  const prospects = await Promise.all([
    prisma.prospect.create({
      data: {
        userId: clientUser.id,
        icpId: icp.id,
        email: 'john.smith@techcorp.com',
        firstName: 'John',
        lastName: 'Smith',
        jobTitle: 'VP of Sales',
        companyName: 'TechCorp Solutions',
        companyDomain: 'techcorp.com',
        companyIndustry: 'Technology',
        companySize: 'LARGE',
        companyRevenue: 'TEN_TO_FIFTY_M',
        companyLocation: 'San Francisco, CA',
        score: 85,
        scoreExplanation: {
          total: 85,
          breakdown: {
            budget: 90,
            authority: 95,
            need: 80,
            timing: 75,
            signals: 85,
          },
          reasoning: {
            budget: 'Company has strong revenue and growth',
            authority: 'VP of Sales is decision maker',
            need: 'Active hiring for sales roles indicates growth',
            timing: 'Budget cycle starts next quarter',
            signals: 'Recent funding round completed',
          },
          confidence: 0.92,
        },
        stage: 'NEW',
        source: 'MANUAL',
      },
    }),
    prisma.prospect.create({
      data: {
        userId: clientUser.id,
        icpId: icp.id,
        email: 'sarah.johnson@innovate.io',
        firstName: 'Sarah',
        lastName: 'Johnson',
        jobTitle: 'Head of Sales',
        companyName: 'Innovate.io',
        companyDomain: 'innovate.io',
        companyIndustry: 'Software',
        companySize: 'MEDIUM',
        companyRevenue: 'ONE_TO_TEN_M',
        companyLocation: 'Toronto, Canada',
        score: 72,
        scoreExplanation: {
          total: 72,
          breakdown: {
            budget: 70,
            authority: 85,
            need: 75,
            timing: 60,
            signals: 70,
          },
          reasoning: {
            budget: 'Mid-market company with steady growth',
            authority: 'Head of Sales has budget authority',
            need: 'Expanding sales team based on job posts',
            timing: 'No immediate buying signals',
            signals: 'Active on LinkedIn, engaging with sales content',
          },
          confidence: 0.85,
        },
        stage: 'NEW',
        source: 'CSV_IMPORT',
      },
    }),
  ]);

  console.log(`✅ ${prospects.length} sample prospects created`);

  // Create a sample email sequence
  const sequence = await prisma.emailSequence.create({
    data: {
      userId: clientUser.id,
      icpId: icp.id,
      name: 'Enterprise Sales Outreach',
      description: 'Multi-step sequence for enterprise B2B prospects',
      steps: {
        create: [
          {
            stepNumber: 1,
            subject: 'Quick question about {{company_name}}\'s sales process',
            content: 'Hi {{first_name}},\\n\\nI noticed {{company_name}} is growing rapidly...',
            delayDays: 0,
          },
          {
            stepNumber: 2,
            subject: 'Re: Quick question about {{company_name}}\'s sales process',
            content: 'Hi {{first_name}},\\n\\nI wanted to follow up on my previous email...',
            delayDays: 3,
            conditions: {
              rules: [{
                type: 'not_opened',
                action: 'send',
              }],
            },
          },
          {
            stepNumber: 3,
            subject: 'Last attempt - {{company_name}}',
            content: 'Hi {{first_name}},\\n\\nI\'ll keep this brief...',
            delayDays: 5,
            conditions: {
              rules: [{
                type: 'not_replied',
                action: 'send',
              }],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Sample email sequence created:', sequence.name);

  // Create AI insights
  const insights = await Promise.all([
    prisma.aIInsight.create({
      data: {
        userId: clientUser.id,
        type: 'RECOMMENDATION',
        title: 'Optimize email send times',
        description: 'Your prospects are most active between 9-11 AM EST. Consider scheduling your emails for this time window to increase open rates by up to 23%.',
        priority: 'HIGH',
        actionable: true,
        metadata: {
          impact: 'high',
          effort: 'low',
          category: 'engagement',
        },
      },
    }),
    prisma.aIInsight.create({
      data: {
        userId: clientUser.id,
        type: 'ALERT',
        title: 'High-value prospect showing interest',
        description: 'John Smith from TechCorp Solutions has opened your last 3 emails and visited your website twice. Consider reaching out with a personalized message.',
        priority: 'URGENT',
        actionable: true,
        metadata: {
          prospectId: prospects[0].id,
          signals: ['email_opens', 'website_visits'],
        },
      },
    }),
  ]);

  console.log(`✅ ${insights.length} AI insights created`);

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('   Admin: admin@aisalesagent.com / AdminPassword123!');
  console.log('   Demo:  demo@aisalesagent.com / DemoPassword123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });