/**
 * ProofHire Deterministic Matching Engine
 * Implements strict scoring policy:
 * - Required skills weight = 80%
 * - Preferred skills weight = 20%
 * - If no preferred skills, required skills = 100%
 * - Score represents documented job fit policy, NEVER hiring probability
 * - Full audit trail with policyVersion, matchedSkills, partialEvidence, gaps, and explanations
 */

export interface SkillEvidenceRef {
  evidenceId: string;
  skillId: string;
  type: 'assessment' | 'project' | 'github' | 'certificate';
  title: string;
  score?: number;
  status: 'VERIFIED' | 'EVIDENCE_FOUND' | 'NEEDS_REVIEW' | 'UNVERIFIABLE' | 'UNVERIFIED';
  verifiedAt?: string;
  url?: string;
}

export interface StudentEvidenceProfile {
  studentId: string;
  studentName: string;
  evidence: SkillEvidenceRef[];
}

export interface JobRequirements {
  jobId: string;
  title: string;
  company: string;
  requiredSkills: { skillId: string; canonicalName: string }[];
  preferredSkills?: { skillId: string; canonicalName: string }[];
}

export interface MatchResult {
  jobId: string;
  studentId: string;
  policyVersion: 'v1.0';
  fitScore: number; // 0 - 100 integer
  requiredScore: number;
  preferredScore: number;
  matchedRequired: string[];
  matchedPreferred: string[];
  partialEvidenceSkills: string[];
  missingRequiredGaps: string[];
  missingPreferredGaps: string[];
  evidenceRefs: string[];
  explanation: string;
}

export class MatchingService {
  public static readonly POLICY_VERSION = 'v1.0';

  /**
   * Deterministically calculate job fit score for a candidate against a job requirement.
   */
  public static calculateFit(
    job: JobRequirements,
    student: StudentEvidenceProfile
  ): MatchResult {
    if (!job.requiredSkills || job.requiredSkills.length === 0) {
      throw new Error("Validation Error: Job must have at least one required skill.");
    }

    const preferred = job.preferredSkills || [];
    const hasPreferred = preferred.length > 0;

    // Map student evidence by skillId
    const evidenceMap = new Map<string, SkillEvidenceRef[]>();
    student.evidence.forEach((ev) => {
      const list = evidenceMap.get(ev.skillId) || [];
      list.push(ev);
      evidenceMap.set(ev.skillId, list);
    });

    const matchedRequired: string[] = [];
    const partialEvidenceSkills: string[] = [];
    const missingRequiredGaps: string[] = [];
    const matchedPreferred: string[] = [];
    const missingPreferredGaps: string[] = [];
    const usedEvidenceIds = new Set<string>();

    // Evaluate Required Skills
    let requiredPoints = 0;
    job.requiredSkills.forEach((req) => {
      const evList = evidenceMap.get(req.skillId);
      if (!evList || evList.length === 0) {
        missingRequiredGaps.push(req.canonicalName);
      } else {
        // Check evidence strength
        const hasVerified = evList.some((e) => e.status === 'VERIFIED');
        const hasFound = evList.some((e) => e.status === 'EVIDENCE_FOUND');
        const needsReview = evList.some((e) => e.status === 'NEEDS_REVIEW');

        evList.forEach((e) => usedEvidenceIds.add(e.evidenceId));

        if (hasVerified) {
          requiredPoints += 1.0;
          matchedRequired.push(req.canonicalName);
        } else if (hasFound) {
          // Evidence found in repo/project but not proctored/certified
          requiredPoints += 0.7;
          partialEvidenceSkills.push(req.canonicalName);
        } else if (needsReview) {
          requiredPoints += 0.4;
          partialEvidenceSkills.push(req.canonicalName);
        } else {
          missingRequiredGaps.push(req.canonicalName);
        }
      }
    });

    // Evaluate Preferred Skills
    let preferredPoints = 0;
    preferred.forEach((pref) => {
      const evList = evidenceMap.get(pref.skillId);
      if (!evList || evList.length === 0) {
        missingPreferredGaps.push(pref.canonicalName);
      } else {
        const hasVerified = evList.some((e) => e.status === 'VERIFIED');
        const hasFound = evList.some((e) => e.status === 'EVIDENCE_FOUND');
        evList.forEach((e) => usedEvidenceIds.add(e.evidenceId));

        if (hasVerified) {
          preferredPoints += 1.0;
          matchedPreferred.push(pref.canonicalName);
        } else if (hasFound) {
          preferredPoints += 0.7;
          matchedPreferred.push(pref.canonicalName);
        } else {
          preferredPoints += 0.4;
          matchedPreferred.push(pref.canonicalName);
        }
      }
    });

    // Score computation
    const requiredFraction = requiredPoints / job.requiredSkills.length;
    let finalScore = 0;
    let requiredScoreComponent = 0;
    let preferredScoreComponent = 0;

    if (hasPreferred) {
      const preferredFraction = preferredPoints / preferred.length;
      requiredScoreComponent = requiredFraction * 80;
      preferredScoreComponent = preferredFraction * 20;
      finalScore = Math.round(requiredScoreComponent + preferredScoreComponent);
    } else {
      requiredScoreComponent = requiredFraction * 100;
      finalScore = Math.round(requiredScoreComponent);
    }

    // Explanatory breakdown
    const parts: string[] = [];
    if (matchedRequired.length > 0) {
      parts.push(`Demonstrated verified evidence for ${matchedRequired.join(', ')}.`);
    }
    if (partialEvidenceSkills.length > 0) {
      parts.push(`Partial/unverified code evidence found for ${partialEvidenceSkills.join(', ')}.`);
    }
    if (missingRequiredGaps.length > 0) {
      parts.push(`No evidence recorded for required: ${missingRequiredGaps.join(', ')}.`);
    }
    if (matchedPreferred.length > 0) {
      parts.push(`Bonus match on preferred: ${matchedPreferred.join(', ')}.`);
    }
    if (missingPreferredGaps.length > 0) {
      parts.push(`Preferred skill gaps: ${missingPreferredGaps.join(', ')}.`);
    }

    const explanation = parts.join(' ');

    return {
      jobId: job.jobId,
      studentId: student.studentId,
      policyVersion: MatchingService.POLICY_VERSION,
      fitScore: Math.min(100, Math.max(0, finalScore)),
      requiredScore: Math.round(requiredScoreComponent),
      preferredScore: Math.round(preferredScoreComponent),
      matchedRequired,
      matchedPreferred,
      partialEvidenceSkills,
      missingRequiredGaps,
      missingPreferredGaps,
      evidenceRefs: Array.from(usedEvidenceIds),
      explanation
    };
  }

  /**
   * Deterministically rank an entire batch of candidates for one JD.
   */
  public static rankBatch(
    job: JobRequirements,
    cohort: StudentEvidenceProfile[]
  ): MatchResult[] {
    const results = cohort.map((st) => this.calculateFit(job, st));
    // Sort descending by fit score, then by required score as tie-breaker
    return results.sort((a, b) => {
      if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
      return b.requiredScore - a.requiredScore;
    });
  }
}
