import { ScoringEngine } from '../scoring-engine';
import { ProspectData, ICPCriteria, ScoreResult } from '../types';

describe('Scoring Engine', () => {
  let engine: ScoringEngine;
  let mockOpenAI: any;

  beforeEach(() => {
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    };
    engine = new ScoringEngine(mockOpenAI);
  });

  describe('calculateBANTScore', () => {
    const icp: ICPCriteria = {
      industry: ['Technology', 'Software'],
      companySize: ['medium', 'large'],
      location: ['United States'],
      keywords: ['SaaS', 'B2B'],
      revenue: '10m_50m',
      jobTitles: ['CEO', 'CTO', 'VP Engineering']
    };

    it('should calculate high score for perfect match', async () => {
      const prospect: ProspectData = {
        email: 'ceo@techcorp.com',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'CEO',
        company: {
          name: 'TechCorp',
          industry: 'Technology',
          size: 'large',
          revenue: '10m_50m',
          location: 'United States',
          employees: 500
        }
      };

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              score: 95,
              breakdown: {
                budget: 95,
                authority: 100,
                need: 90,
                timing: 95
              },
              confidence: 0.95
            })
          }
        }]
      });

      const result = await engine.calculateBANTScore(prospect, icp);

      expect(result.score).toBe(95);
      expect(result.breakdown.authority).toBe(100);
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should calculate low score for poor match', async () => {
      const prospect: ProspectData = {
        email: 'intern@startup.com',
        jobTitle: 'Intern',
        company: {
          name: 'Small Startup',
          industry: 'Retail',
          size: 'startup',
          revenue: 'under_1m',
          location: 'India',
          employees: 5
        }
      };

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              score: 25,
              breakdown: {
                budget: 20,
                authority: 10,
                need: 40,
                timing: 30
              },
              confidence: 0.85
            })
          }
        }]
      });

      const result = await engine.calculateBANTScore(prospect, icp);

      expect(result.score).toBeLessThan(30);
      expect(result.breakdown.authority).toBeLessThan(20);
    });

    it('should handle missing data gracefully', async () => {
      const prospect: ProspectData = {
        email: 'test@example.com',
        company: {
          name: 'Unknown Company'
        }
      };

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              score: 50,
              breakdown: {
                budget: 50,
                authority: 50,
                need: 50,
                timing: 50
              },
              confidence: 0.5
            })
          }
        }]
      });

      const result = await engine.calculateBANTScore(prospect, icp);

      expect(result.score).toBe(50);
      expect(result.confidence).toBeLessThanOrEqual(0.5);
    });
  });

  describe('generateExplanation', () => {
    it('should generate clear explanation in English', async () => {
      const scoreResult: ScoreResult = {
        score: 85,
        breakdown: {
          budget: 90,
          authority: 95,
          need: 80,
          timing: 75,
          signals: 85
        },
        confidence: 0.9
      };

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: 'This prospect shows strong potential based on company size and decision-making authority. The large enterprise has budget capacity and the CEO role indicates final decision power.'
          }
        }]
      });

      const explanation = await engine.generateExplanation(scoreResult, 'en');

      expect(explanation).toContain('strong potential');
      expect(explanation).toContain('decision');
      expect(explanation.length).toBeGreaterThan(50);
    });

    it('should generate explanation in French when requested', async () => {
      const scoreResult: ScoreResult = {
        score: 75,
        breakdown: {
          budget: 80,
          authority: 70,
          need: 75,
          timing: 75,
          signals: 75
        },
        confidence: 0.85
      };

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: 'Ce prospect montre un bon potentiel basé sur la taille de l\'entreprise et l\'autorité décisionnelle.'
          }
        }]
      });

      const explanation = await engine.generateExplanation(scoreResult, 'fr');

      expect(explanation).toContain('prospect');
      expect(explanation).toContain('potentiel');
    });
  });

  describe('detectSignals', () => {
    it('should detect positive buying signals', () => {
      const prospect: ProspectData = {
        email: 'cto@growthcompany.com',
        jobTitle: 'CTO',
        company: {
          name: 'Growth Company',
          employees: 100,
          previousEmployees: 50, // Doubled in size
          fundingRound: 'Series B',
          recentNews: ['Raised $50M', 'Expanding to Europe']
        },
        websiteActivity: {
          pricingPageVisits: 5,
          demoRequested: true
        }
      };

      const signals = engine.detectSignals(prospect);

      expect(signals).toContain('rapid_growth');
      expect(signals).toContain('recent_funding');
      expect(signals).toContain('high_engagement');
      expect(signals).toContain('expansion');
    });

    it('should detect negative signals', () => {
      const prospect: ProspectData = {
        email: 'admin@strugglingco.com',
        jobTitle: 'Admin',
        company: {
          name: 'Struggling Co',
          employees: 20,
          previousEmployees: 50, // Downsizing
          recentNews: ['Layoffs announced', 'Office closures']
        },
        previousInteractions: [
          { type: 'email', response: 'not interested' },
          { type: 'email', response: 'unsubscribe' }
        ]
      };

      const signals = engine.detectSignals(prospect);

      expect(signals).toContain('downsizing');
      expect(signals).toContain('negative_response');
      expect(signals).toContain('low_authority');
    });

    it('should handle missing signal data', () => {
      const prospect: ProspectData = {
        email: 'test@example.com',
        company: {
          name: 'Test Company'
        }
      };

      const signals = engine.detectSignals(prospect);

      expect(signals).toEqual([]);
    });
  });

  describe('adjustConfidence', () => {
    it('should increase confidence with more data points', () => {
      const baseConfidence = 0.7;
      
      const richData = {
        email: 'ceo@company.com',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'CEO',
        phone: '+1234567890',
        linkedinUrl: 'linkedin.com/in/johndoe',
        company: {
          name: 'Company',
          domain: 'company.com',
          industry: 'Tech',
          size: 'large',
          revenue: '50m',
          employees: 500,
          location: 'USA',
          founded: 2010
        }
      };

      const adjustedConfidence = engine.adjustConfidence(baseConfidence, richData);

      expect(adjustedConfidence).toBeGreaterThan(baseConfidence);
      expect(adjustedConfidence).toBeGreaterThan(0.85);
    });

    it('should decrease confidence with minimal data', () => {
      const baseConfidence = 0.7;
      
      const minimalData = {
        email: 'test@example.com',
        company: {
          name: 'Unknown'
        }
      };

      const adjustedConfidence = engine.adjustConfidence(baseConfidence, minimalData);

      expect(adjustedConfidence).toBeLessThan(baseConfidence);
      expect(adjustedConfidence).toBeLessThan(0.5);
    });

    it('should cap confidence at 1.0', () => {
      const baseConfidence = 0.95;
      
      const perfectData = {
        // All fields filled
        email: 'ceo@company.com',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'CEO',
        phone: '+1234567890',
        linkedinUrl: 'linkedin.com/in/johndoe',
        websiteUrl: 'johndoe.com',
        company: {
          name: 'Company',
          domain: 'company.com',
          industry: 'Tech',
          size: 'large',
          revenue: '100m+',
          employees: 1000,
          location: 'USA',
          founded: 2010,
          technologies: ['AWS', 'React', 'Node.js'],
          description: 'Leading tech company'
        }
      };

      const adjustedConfidence = engine.adjustConfidence(baseConfidence, perfectData);

      expect(adjustedConfidence).toBeLessThanOrEqual(1.0);
      expect(adjustedConfidence).toBeGreaterThan(0.95);
    });
  });

  describe('compareToICP', () => {
    it('should calculate match percentage', () => {
      const icp: ICPCriteria = {
        industry: ['Technology', 'Software'],
        companySize: ['medium', 'large'],
        location: ['United States', 'Canada'],
        keywords: ['SaaS', 'Cloud', 'B2B'],
        jobTitles: ['CEO', 'CTO', 'VP']
      };

      const prospect: ProspectData = {
        email: 'cto@saascompany.com',
        jobTitle: 'CTO',
        company: {
          name: 'SaaS Company',
          industry: 'Software',
          size: 'medium',
          location: 'United States'
        }
      };

      const matchScore = engine.compareToICP(prospect, icp);

      expect(matchScore).toBeGreaterThan(0.8); // High match
    });

    it('should handle partial matches', () => {
      const icp: ICPCriteria = {
        industry: ['Technology'],
        companySize: ['enterprise'],
        location: ['United States'],
        revenue: 'over_100m'
      };

      const prospect: ProspectData = {
        email: 'test@company.com',
        company: {
          name: 'Company',
          industry: 'Technology', // Match
          size: 'medium', // No match
          location: 'Canada', // No match
          revenue: '10m_50m' // No match
        }
      };

      const matchScore = engine.compareToICP(prospect, icp);

      expect(matchScore).toBeGreaterThan(0.2);
      expect(matchScore).toBeLessThan(0.5);
    });
  });
});
