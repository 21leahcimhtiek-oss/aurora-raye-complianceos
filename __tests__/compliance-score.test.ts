import { calculateComplianceScore, calculateFrameworkProgress, getRiskLevel } from '../lib/compliance-score';

describe('Compliance score calculations', () => {
  describe('calculateComplianceScore', () => {
    it('returns 0 for all not_started controls', () => {
      const controls = [
        { id: '1', status: 'not_started' as const },
        { id: '2', status: 'not_started' as const },
      ];
      expect(calculateComplianceScore(controls)).toBe(0);
    });
    it('returns 100 for all implemented controls', () => {
      const controls = [
        { id: '1', status: 'implemented' as const },
        { id: '2', status: 'implemented' as const },
      ];
      expect(calculateComplianceScore(controls)).toBe(100);
    });
    it('calculates partial compliance correctly', () => {
      const controls = [
        { id: '1', status: 'implemented' as const },
        { id: '2', status: 'not_started' as const },
        { id: '3', status: 'in_progress' as const },
        { id: '4', status: 'implemented' as const },
      ];
      expect(calculateComplianceScore(controls)).toBe(50);
    });
    it('excludes not_applicable controls from score', () => {
      const controls = [
        { id: '1', status: 'implemented' as const },
        { id: '2', status: 'not_applicable' as const },
      ];
      expect(calculateComplianceScore(controls)).toBe(100);
    });
    it('returns 0 when all controls are not_applicable', () => {
      const controls = [{ id: '1', status: 'not_applicable' as const }];
      expect(calculateComplianceScore(controls)).toBe(0);
    });
  });
  describe('getRiskLevel', () => {
    it('returns critical for high likelihood and impact', () => {
      expect(getRiskLevel(5, 5)).toBe('critical');
    });
    it('returns low for low likelihood and impact', () => {
      expect(getRiskLevel(1, 2)).toBe('low');
    });
    it('returns high for 4x3', () => {
      expect(getRiskLevel(4, 3)).toBe('high');
    });
  });
});