/**
 * Seed fixtures for demo acceptance scenario:
 * 5 students with distinct verified, partial, and missing evidence
 * Canonical JD with required & preferred skills
 * Seeded credentials and assessments
 */

import { StudentEvidenceProfile, JobRequirements } from './services/matchingPolicy';

export const DEMO_COHORT_STUDENTS: StudentEvidenceProfile[] = [
  {
    studentId: "student-alex-001",
    studentName: "Alex Morgan",
    evidence: [
      {
        evidenceId: "ev-alex-react-ass",
        skillId: "skill-react",
        type: "assessment",
        title: "Proctored React SkillCheck v2",
        score: 94,
        status: "VERIFIED",
        verifiedAt: "2026-10-10"
      },
      {
        evidenceId: "ev-alex-react-proj",
        skillId: "skill-react",
        type: "project",
        title: "E-Commerce Web Platform",
        status: "VERIFIED",
        verifiedAt: "2026-10-05"
      },
      {
        evidenceId: "ev-alex-js-repo",
        skillId: "skill-javascript",
        type: "github",
        title: "alexmorgan/frontend-utilities",
        status: "VERIFIED",
        verifiedAt: "2026-09-20"
      },
      {
        evidenceId: "ev-alex-node-proj",
        skillId: "skill-nodejs",
        type: "project",
        title: "TaskFlow SaaS Micro-API",
        status: "VERIFIED",
        verifiedAt: "2026-08-15"
      },
      {
        evidenceId: "ev-alex-ts-repo",
        skillId: "skill-typescript",
        type: "github",
        title: "alexmorgan/ts-types-lib",
        status: "EVIDENCE_FOUND",
        verifiedAt: "2026-10-01"
      }
    ]
  },
  {
    studentId: "student-priya-002",
    studentName: "Priya Sharma",
    evidence: [
      {
        evidenceId: "ev-priya-react-proj",
        skillId: "skill-react",
        type: "project",
        title: "Healthcare Dashboard",
        status: "VERIFIED",
        verifiedAt: "2026-10-02"
      },
      {
        evidenceId: "ev-priya-js-ass",
        skillId: "skill-javascript",
        type: "assessment",
        title: "ES6+ Modern JavaScript Proctored Exam",
        score: 96,
        status: "VERIFIED",
        verifiedAt: "2026-09-28"
      },
      {
        evidenceId: "ev-priya-pg-ass",
        skillId: "skill-postgres",
        type: "assessment",
        title: "PostgreSQL Database Design Assessment",
        score: 88,
        status: "VERIFIED",
        verifiedAt: "2026-10-12"
      },
      {
        evidenceId: "ev-priya-ts-cert",
        skillId: "skill-typescript",
        type: "certificate",
        title: "Advanced TypeScript Certification (Verified Issuer)",
        score: 90,
        status: "VERIFIED",
        verifiedAt: "2026-09-10"
      }
    ]
  },
  {
    studentId: "student-rohit-003",
    studentName: "Rohit Verma",
    evidence: [
      {
        evidenceId: "ev-rohit-java-ass",
        skillId: "skill-java",
        type: "assessment",
        title: "Enterprise Java & Algorithms Benchmark",
        score: 92,
        status: "VERIFIED",
        verifiedAt: "2026-09-15"
      },
      {
        evidenceId: "ev-rohit-dsa-proj",
        skillId: "skill-dsa",
        type: "project",
        title: "High Performance Graph Router",
        status: "VERIFIED",
        verifiedAt: "2026-08-20"
      },
      {
        evidenceId: "ev-rohit-react-repo",
        skillId: "skill-react",
        type: "github",
        title: "rohit/react-portfolio",
        status: "NEEDS_REVIEW",
        verifiedAt: "2026-10-14"
      }
    ]
  },
  {
    studentId: "student-sarah-004",
    studentName: "Sarah Jenkins",
    evidence: [
      {
        evidenceId: "ev-sarah-react-ass",
        skillId: "skill-react",
        type: "assessment",
        title: "React Intermediate Evaluation",
        score: 75,
        status: "VERIFIED",
        verifiedAt: "2026-10-08"
      },
      {
        evidenceId: "ev-sarah-js-proj",
        skillId: "skill-javascript",
        type: "project",
        title: "Interactive Weather Radar",
        status: "EVIDENCE_FOUND",
        verifiedAt: "2026-09-01"
      }
    ]
  },
  {
    studentId: "student-dev-005",
    studentName: "Dev Patel",
    evidence: [
      {
        evidenceId: "ev-dev-git-repo",
        skillId: "skill-git",
        type: "github",
        title: "devpatel/open-source-tools",
        status: "EVIDENCE_FOUND",
        verifiedAt: "2026-09-11"
      }
    ]
  }
];

export const DEMO_PLACEMENT_JOB: JobRequirements = {
  jobId: "job-technova-frontend-001",
  title: "Frontend Software Engineer Intern",
  company: "TechNova",
  requiredSkills: [
    { skillId: "skill-react", canonicalName: "React" },
    { skillId: "skill-javascript", canonicalName: "JavaScript" }
  ],
  preferredSkills: [
    { skillId: "skill-typescript", canonicalName: "TypeScript" },
    { skillId: "skill-postgres", canonicalName: "PostgreSQL" }
  ]
};
