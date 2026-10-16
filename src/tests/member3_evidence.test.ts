import { describe, it, expect } from 'vitest';
import { normalizeSkill, extractSkillsFromText, SKILL_CATALOGUE } from '../services/skillNormalizer';
import { MatchingService, JobRequirements, StudentEvidenceProfile } from '../services/matchingPolicy';
import { AssessmentEngine } from '../services/assessmentEngine';
import { GitHubEvidenceService } from '../services/githubAnalyzer';
import { ResumeIntelligenceService } from '../services/resumeClaims';
import { DEMO_COHORT_STUDENTS, DEMO_PLACEMENT_JOB } from '../data/demoFixtures';

describe('Member 3: Evidence Engine & Core Services Unit Tests', () => {

  describe('1. Skill Catalogue & Normalization', () => {
    it('normalizes common variants correctly into canonical names', () => {
      expect(normalizeSkill('ReactJS')?.canonicalName).toBe('React');
      expect(normalizeSkill('react.js')?.canonicalName).toBe('React');
      expect(normalizeSkill('React')?.canonicalName).toBe('React');
      expect(normalizeSkill('Postgres')?.canonicalName).toBe('PostgreSQL');
      expect(normalizeSkill('NodeJS')?.canonicalName).toBe('Node.js');
      expect(normalizeSkill('TS')?.canonicalName).toBe('TypeScript');
    });

    it('distinguishes Java from JavaScript safely without substring bleed', () => {
      const java = normalizeSkill('Java');
      const js = normalizeSkill('JavaScript');
      expect(java?.canonicalName).toBe('Java');
      expect(js?.canonicalName).toBe('JavaScript');
      expect(java?.id).not.toBe(js?.id);
    });

    it('extracts canonical skills from complex JD text tokens', () => {
      const jd = "Looking for a React developer proficient in TypeScript, Node.js, and Postgres databases.";
      const extracted = extractSkillsFromText(jd);
      const names = extracted.map(e => e.skill.canonicalName);
      expect(names).toContain('React');
      expect(names).toContain('TypeScript');
      expect(names).toContain('Node.js');
      expect(names).toContain('PostgreSQL');
    });
  });

  describe('2. Deterministic Matching & Batch Ranking Policy', () => {
    it('applies 80% required and 20% preferred policy', () => {
      const alex = DEMO_COHORT_STUDENTS.find(s => s.studentId === 'student-alex-001')!;
      const match = MatchingService.calculateFit(DEMO_PLACEMENT_JOB, alex);

      expect(match.policyVersion).toBe('v1.0');
      // Alex has 2/2 required verified (80 points)
      // Alex has 1 partial preferred (TypeScript found in repo ~ 0.7 * 10 = 7 pts)
      expect(match.matchedRequired).toEqual(expect.arrayContaining(['React', 'JavaScript']));
      expect(match.fitScore).toBeGreaterThanOrEqual(80);
      expect(match.fitScore).toBeLessThanOrEqual(95);
      expect(match.evidenceRefs.length).toBeGreaterThan(0);
    });

    it('ranks 5 demo cohort students deterministically with reproducible order', () => {
      const ranked = MatchingService.rankBatch(DEMO_PLACEMENT_JOB, DEMO_COHORT_STUDENTS);

      expect(ranked.length).toBe(5);
      // Priya has all required verified and both preferred verified -> should be #1
      expect(ranked[0].studentId).toBe('student-priya-002');
      expect(ranked[0].fitScore).toBe(100);

      // Alex has required verified and partial preferred -> should be #2
      expect(ranked[1].studentId).toBe('student-alex-001');

      // Dev Patel has 0 matching required skills -> lowest score
      expect(ranked[4].studentId).toBe('student-dev-005');
      expect(ranked[4].fitScore).toBe(0);
    });

    it('throws validation error if job has no required skills', () => {
      const invalidJob: JobRequirements = {
        jobId: "bad-job",
        title: "Bad",
        company: "Bad",
        requiredSkills: []
      };
      const alex = DEMO_COHORT_STUDENTS[0];
      expect(() => MatchingService.calculateFit(invalidJob, alex)).toThrow(/at least one required skill/i);
    });
  });

  describe('3. Assessment Grading Engine', () => {
    it('accurately grades MCQ questions and assigns proctored benchmark ID', () => {
      const attempt = AssessmentEngine.gradeAttempt('student-alex-001', 'skill-react', [
        { questionId: 'q-react-1', selectedIndex: 2 }, // correct
        { questionId: 'q-react-2', selectedIndex: 1 }, // correct
        { questionId: 'q-react-3', selectedIndex: 1 }  // correct
      ]);

      expect(attempt.score).toBe(100);
      expect(attempt.passed).toBe(true);
      expect(attempt.proctoredId).toMatch(/^PROC-REACT-/);
    });
  });

  describe('4. GitHub Repository Analyzer', () => {
    it('safely parses github repository URLs', () => {
      const parsed = GitHubEvidenceService.parseRepoUrl('https://github.com/facebook/react');
      expect(parsed?.owner).toBe('facebook');
      expect(parsed?.repo).toBe('react');
    });

    it('gracefully inspects repository evidence without code execution', async () => {
      const finding = await GitHubEvidenceService.inspectRepository('https://github.com/alexmorgan-dev/e-commerce-store');
      expect(finding.status).toBe('EVIDENCE_FOUND');
      expect(finding.detectedSkills).toContain('React');
    });
  });

  describe('5. Truthful Resume Claim Auditor', () => {
    it('flags unverified claims as NEEDS_REVIEW without falsely accusing fraud', () => {
      const alex = DEMO_COHORT_STUDENTS[0];
      const audits = ResumeIntelligenceService.auditResumeClaims(
        ['React component architecture', 'Kubernetes cluster deployment'],
        alex.evidence
      );

      const reactClaim = audits.find(a => a.associatedSkill === 'React')!;
      const k8sClaim = audits.find(a => a.associatedSkill === 'Kubernetes')!;

      expect(reactClaim.status).toBe('SUPPORTED');
      expect(k8sClaim.status).toBe('NEEDS_REVIEW');
      expect(k8sClaim.auditReason).toMatch(/No corresponding evidence artifact recorded/i);
    });
  });

});
