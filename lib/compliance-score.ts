export interface ControlStatus {
  id: string;
  status: 'not_started' | 'in_progress' | 'implemented' | 'not_applicable';
}

export function calculateComplianceScore(controls: ControlStatus[]): number {
  const applicable = controls.filter(c => c.status !== 'not_applicable');
  if (applicable.length === 0) return 0;
  const implemented = applicable.filter(c => c.status === 'implemented').length;
  return Math.round((implemented / applicable.length) * 100);
}

export function calculateFrameworkProgress(controls: ControlStatus[]): {
  total: number;
  applicable: number;
  implemented: number;
  inProgress: number;
  notStarted: number;
  notApplicable: number;
  score: number;
} {
  const total = controls.length;
  const notApplicable = controls.filter(c => c.status === 'not_applicable').length;
  const applicable = total - notApplicable;
  const implemented = controls.filter(c => c.status === 'implemented').length;
  const inProgress = controls.filter(c => c.status === 'in_progress').length;
  const notStarted = controls.filter(c => c.status === 'not_started').length;
  const score = calculateComplianceScore(controls);
  return { total, applicable, implemented, inProgress, notStarted, notApplicable, score };
}

export function getRiskLevel(likelihood: number, impact: number): 'critical' | 'high' | 'medium' | 'low' {
  const score = likelihood * impact;
  if (score >= 20) return 'critical';
  if (score >= 12) return 'high';
  if (score >= 6) return 'medium';
  return 'low';
}