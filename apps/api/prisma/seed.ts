import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aisalesagent.com' },
    update: {},
    create: {
      email: 'admin@aisalesagent.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      plan: 'BUSINESS',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      language: 'en',
      timezone: 'UTC',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create demo user
  const demoPasswordHash = await bcrypt.hash('Demo123!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash: demoPasswordHash,
      firstName: 'Demo',
      lastName: 'User',
      role: 'CLIENT',
      plan: 'STARTER',
      companyName: 'Demo Company Inc.',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      language: 'en',
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Create sample ICP for demo user
  const sampleICP = await prisma.iCP.create({
    data: {
      userId: demoUser.id,
      name: 'Tech Startups',
      description: 'B2B SaaS companies in growth stage',
      criteria: {
        industry: ['Technology', 'Software'],
        companySize: ['startup', 'small'],
        revenue: 'one_to_ten_m',
        location: ['United States', 'Canada'],
        keywords: ['SaaS', 'B2B', 'cloud', 'software'],
        jobTitles: ['CEO', 'CTO', 'VP Sales', 'Head of Growth'],
        technologies: ['AWS', 'React', 'Node.js'],
      },
    },
  });

  console.log('✅ Sample ICP created:', sampleICP.name);

  // Create sample prospects
  const prospects = [
    {
      email: 'john.smith@techstartup.com',
      firstName: 'John',
      lastName: 'Smith',
      jobTitle: 'CEO',
      companyName: 'TechStartup Inc.',
      companyDomain: 'techstartup.com',
      companyIndustry: 'Technology',
      companySize: 'startup' as const,
      companyLocation: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/johnsmith',
    },
    {
      email: 'sarah.johnson@cloudsoft.io',
      firstName: 'Sarah',
      lastName: 'Johnson',
      jobTitle: 'VP Sales',
      companyName: 'CloudSoft Solutions',
      companyDomain: 'cloudsoft.io',
      companyIndustry: 'Software',
      companySize: 'small' as const,
      companyLocation: 'Toronto, ON',
      linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    },
    {
      email: 'mike.chen@dataflow.ai',
      firstName: 'Mike',
      lastName: 'Chen',
      jobTitle: 'CTO',
      companyName: 'DataFlow AI',
      companyDomain: 'dataflow.ai',
      companyIndustry: 'AI/ML',
      companySize: 'startup' as const,
      companyLocation: 'Austin, TX',
      websiteUrl: 'https://dataflow.ai',
    },
  ];

  for (const prospectData of prospects) {
    const prospect = await prisma.prospect.create({
      data: {
        userId: demoUser.id,
        icpId: sampleICP.id,
        ...prospectData,
        score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
        scoreExplanation: {
          total: 75,
          breakdown: {
            budget: 80,
            authority: 90,
            need: 70,
            timing: 60,
            signals: 75,
          },
          reasoning: {
            budget: 'Company in growth stage with recent funding',
            authority: 'Direct decision maker role',
            need: 'Shows indicators of needing sales automation',
            timing: 'Currently evaluating solutions',
            signals: 'Active on LinkedIn, recent job posting for sales roles',
          },
          confidence: 0.85,
        },
        source: 'manual',
        stage: 'new',
      },
    });

    console.log('✅ Prospect created:', prospect.email);
  }

  // Create sample email sequence
  const emailSequence = await prisma.emailSequence.create({
    data: {
      userId: demoUser.id,
      icpId: sampleICP.id,
      name: 'Tech Startup Outreach',
      description: '3-step sequence for tech startup prospects',
      steps: {
        create: [
          {
            stepNumber: 1,
            subject: 'Quick question about {{company_name}}',
            content: `Hi {{first_name}},

I noticed {{company_name}} is growing rapidly in the {{industry}} space. Congrats on the recent achievements!

Many companies at your stage struggle with scaling their sales outreach efficiently. We help B2B companies like yours automate prospect qualification and personalized messaging using AI.

Would you be interested in a quick 15-minute call to see if we could help {{company_name}} accelerate growth?

Best regards,
{{sender_name}}`,
            delayDays: 0,
          },
          {
            stepNumber: 2,
            subject: 'Re: Quick question about {{company_name}}',
            content: `Hi {{first_name}},

I wanted to follow up on my previous email. I understand you're busy building {{company_name}}.

Just to give you a quick idea - we recently helped a similar company increase their qualified leads by 3x while reducing their sales team's manual work by 60%.

Is improving sales efficiency a priority for {{company_name}} this quarter?

Best,
{{sender_name}}`,
            delayDays: 3,
          },
          {
            stepNumber: 3,
            subject: 'Last check-in',
            content: `Hi {{first_name}},

I haven't heard back from you, so I'm assuming sales automation isn't a priority right now.

If things change and you'd like to learn how AI can help {{company_name}} scale its B2B sales, feel free to reach out.

I'll check back in a few months. Best of luck with everything!

{{sender_name}}`,
            delayDays: 7,
          },
        ],
      },
    },
  });

  console.log('✅ Email sequence created:', emailSequence.name);

  // Create a sample campaign
  const campaign = await prisma.campaign.create({
    data: {
      userId: demoUser.id,
      sequenceId: emailSequence.id,
      name: 'Q1 2025 Tech Outreach',
      description: 'Outreach campaign for tech startups',
      status: 'draft',
    },
  });

  console.log('✅ Campaign created:', campaign.name);

  // Create sample AI insights
  const insights = [
    {
      type: 'recommendation' as const,
      title: 'Optimize email send times',
      description: 'Your prospects in the tech industry show highest engagement between 10-11 AM EST. Consider scheduling your emails during this window.',
      priority: 'high' as const,
    },
    {
      type: 'trend' as const,
      title: 'Increasing response rates',
      description: 'Your response rates have increased by 15% over the last week. The personalized subject lines seem to be working well.',
      priority: 'normal' as const,
    },
    {
      type: 'alert' as const,
      title: '5 prospects ready for follow-up',
      description: 'Based on engagement signals, 5 prospects in your pipeline are showing high intent and should be contacted today.',
      priority: 'urgent' as const,
    },
  ];

  for (const insightData of insights) {
    const insight = await prisma.aIInsight.create({
      data: {
        userId: demoUser.id,
        ...insightData,
        actionable: true,
      },
    });

    console.log('✅ AI Insight created:', insight.title);
  }

  // Create sample subscription for demo user
  const subscription = await prisma.subscription.create({
    data: {
      userId: demoUser.id,
      plan: 'STARTER',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      usage: {
        prospects: 3,
        icps: 1,
        sequences: 1,
        messages: 0,
        limits: {
          prospects: 200,
          icps: 1,
          sequences: 1,
          messages: 1000,
          teamMembers: 1,
        },
      },
    },
  });

  console.log('✅ Subscription created for demo user');

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
