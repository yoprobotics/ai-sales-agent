import { createMocks } from 'node-mocks-http';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Mock handlers
import { createProspect, getProspects, qualifyProspect } from '../pages/api/prospects';

const prisma = global.prisma as PrismaClient;

describe('Prospects API', () => {
  let userId: string;
  let icpId: string;
  let authToken: string;

  beforeEach(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed',
        firstName: 'Test',
        lastName: 'User',
        role: 'CLIENT',
        plan: 'PRO',
        dataRegion: 'US',
        language: 'en',
        isEmailVerified: true
      }
    });
    userId = user.id;

    // Create test ICP
    const icp = await prisma.iCP.create({
      data: {
        userId,
        name: 'Test ICP',
        criteria: {
          industry: ['Technology'],
          companySize: ['medium', 'large'],
          location: ['United States'],
          keywords: ['SaaS', 'B2B']
        },
        isActive: true
      }
    });
    icpId = icp.id;

    // Generate auth token
    authToken = jwt.sign(
      { userId, email: 'test@example.com', role: 'CLIENT' },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
  });

  describe('POST /api/prospects', () => {
    it('should create a new prospect', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        body: {
          email: 'prospect@company.com',
          firstName: 'John',
          lastName: 'Doe',
          jobTitle: 'CEO',
          company: {
            name: 'Tech Corp',
            domain: 'techcorp.com',
            industry: 'Technology',
            size: 'medium',
            location: 'San Francisco, CA'
          },
          icpId,
          source: 'manual'
        }
      });

      await createProspect(req, res);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.email).toBe('prospect@company.com');
      expect(data.data.company.name).toBe('Tech Corp');
      expect(data.data.score).toBeDefined();
      expect(data.data.stage).toBe('new');
    });

    it('should prevent duplicate prospects', async () => {
      // Create first prospect
      await prisma.prospect.create({
        data: {
          userId,
          icpId,
          email: 'duplicate@company.com',
          company: {
            name: 'Company'
          },
          score: 0,
          stage: 'new',
          source: 'manual',
          isOptedOut: false
        }
      });

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        body: {
          email: 'duplicate@company.com',
          company: {
            name: 'Company'
          },
          icpId,
          source: 'manual'
        }
      });

      await createProspect(req, res);

      expect(res._getStatusCode()).toBe(409);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('DUPLICATE_PROSPECT');
    });

    it('should validate required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        body: {
          email: 'invalid-email',
          icpId: 'invalid-uuid'
        }
      });

      await createProspect(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/prospects', () => {
    beforeEach(async () => {
      // Create test prospects
      const prospects = [
        {
          userId,
          icpId,
          email: 'prospect1@company.com',
          firstName: 'Alice',
          lastName: 'Smith',
          company: { name: 'Company A' },
          score: 85,
          stage: 'contacted',
          source: 'csv_import',
          isOptedOut: false
        },
        {
          userId,
          icpId,
          email: 'prospect2@company.com',
          firstName: 'Bob',
          lastName: 'Jones',
          company: { name: 'Company B' },
          score: 60,
          stage: 'new',
          source: 'manual',
          isOptedOut: false
        },
        {
          userId,
          icpId,
          email: 'prospect3@company.com',
          firstName: 'Charlie',
          lastName: 'Brown',
          company: { name: 'Company C' },
          score: 95,
          stage: 'meeting',
          source: 'url_scraping',
          isOptedOut: false
        }
      ];

      for (const prospect of prospects) {
        await prisma.prospect.create({ data: prospect });
      }
    });

    it('should get paginated prospects', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        query: {
          page: '1',
          limit: '2'
        }
      });

      await getProspects(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.prospects).toHaveLength(2);
      expect(data.meta.total).toBe(3);
      expect(data.meta.page).toBe(1);
      expect(data.meta.hasNext).toBe(true);
    });

    it('should filter prospects by stage', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        query: {
          stage: 'new'
        }
      });

      await getProspects(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.prospects).toHaveLength(1);
      expect(data.data.prospects[0].stage).toBe('new');
    });

    it('should filter prospects by score range', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        query: {
          scoreMin: '80',
          scoreMax: '100'
        }
      });

      await getProspects(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.prospects).toHaveLength(2);
      expect(data.data.prospects.every(p => p.score >= 80)).toBe(true);
    });

    it('should search prospects by name or email', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        query: {
          search: 'Alice'
        }
      });

      await getProspects(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.prospects).toHaveLength(1);
      expect(data.data.prospects[0].firstName).toBe('Alice');
    });
  });

  describe('POST /api/prospects/:id/qualify', () => {
    let prospectId: string;

    beforeEach(async () => {
      const prospect = await prisma.prospect.create({
        data: {
          userId,
          icpId,
          email: 'qualify@company.com',
          firstName: 'Test',
          lastName: 'Prospect',
          company: {
            name: 'Big Tech Corp',
            size: 'enterprise',
            industry: 'Technology',
            revenue: '50m_100m',
            employees: 500
          },
          score: 0,
          stage: 'new',
          source: 'manual',
          isOptedOut: false
        }
      });
      prospectId = prospect.id;
    });

    it('should qualify prospect with AI scoring', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        query: {
          id: prospectId
        }
      });

      await qualifyProspect(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.score).toBe(85);
      expect(data.data.scoreExplanation).toBeDefined();
      expect(data.data.scoreExplanation.breakdown).toHaveProperty('budget');
      expect(data.data.scoreExplanation.breakdown).toHaveProperty('authority');
      expect(data.data.scoreExplanation.breakdown).toHaveProperty('need');
      expect(data.data.scoreExplanation.breakdown).toHaveProperty('timing');
      expect(data.data.scoreExplanation.confidence).toBeGreaterThan(0);

      // Verify database was updated
      const updatedProspect = await prisma.prospect.findUnique({
        where: { id: prospectId }
      });
      expect(updatedProspect?.score).toBe(85);
    });

    it('should handle AI service errors gracefully', async () => {
      // Mock OpenAI to throw error
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const OpenAI = require('openai').default;
      OpenAI.prototype.chat.completions.create.mockRejectedValueOnce(
        new Error('OpenAI service unavailable')
      );

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        query: {
          id: prospectId
        }
      });

      await qualifyProspect(req, res);

      expect(res._getStatusCode()).toBe(502);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('AI_SERVICE_ERROR');
    });

    it('should enforce rate limiting', async () => {
      // Simulate multiple rapid requests
      const requests = [];
      for (let i = 0; i < 10; i++) {
        const { req, res } = createMocks({
          method: 'POST',
          headers: {
            authorization: `Bearer ${authToken}`,
            'x-forwarded-for': '192.168.1.1'
          },
          query: {
            id: prospectId
          }
        });
        requests.push({ req, res });
      }

      // Process requests
      for (let i = 0; i < requests.length; i++) {
        await qualifyProspect(requests[i].req, requests[i].res);
        
        if (i < 5) {
          // First 5 requests should succeed
          expect(requests[i].res._getStatusCode()).toBe(200);
        } else {
          // Subsequent requests should be rate limited
          expect(requests[i].res._getStatusCode()).toBe(429);
          const data = JSON.parse(requests[i].res._getData());
          expect(data.error.code).toBe('RATE_LIMIT_EXCEEDED');
        }
      }
    });
  });
});
