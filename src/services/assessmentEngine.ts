import { normalizeSkill, extractSkillsFromText, CanonicalSkill } from './skillNormalizer';

export interface AssessmentQuestion {
  id: string;
  skillId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssessmentAttempt {
  attemptId: string;
  studentId: string;
  skillId: string;
  score: number; // percentage 0-100
  passed: boolean;
  timestamp: string;
  answers: { questionId: string; selectedIndex: number; correct: boolean }[];
  proctoredId: string;
}

export const MCQ_ASSESSMENT_BANK: Record<string, AssessmentQuestion[]> = {
  "skill-react": [
    {
      id: "q-react-1",
      skillId: "skill-react",
      question: "Which hook should be used to avoid unnecessary recalculations of an expensive value between renders?",
      options: ["useEffect", "useCallback", "useMemo", "useRef"],
      correctIndex: 2,
      explanation: "useMemo caches the result of a calculation between renders until dependencies change."
    },
    {
      id: "q-react-2",
      skillId: "skill-react",
      question: "In React 18, which function is used to initialize the root for concurrent rendering?",
      options: ["ReactDOM.render()", "ReactDOM.createRoot()", "ReactDOM.hydrateRoot()", "ReactDOM.mount()"],
      correctIndex: 1,
      explanation: "createRoot was introduced in React 18 to enable concurrent features."
    },
    {
      id: "q-react-3",
      skillId: "skill-react",
      question: "Why should keys passed to list elements be stable, unique, and predictable?",
      options: [
        "To make CSS selectors simpler",
        "To allow React to determine which items changed, were added, or were removed during reconciliation",
        "To bind DOM event listeners efficiently",
        "Keys are optional in strict mode"
      ],
      correctIndex: 1,
      explanation: "Keys guide React's virtual DOM diffing algorithm to preserve component identity and state across re-renders."
    }
  ],
  "skill-typescript": [
    {
      id: "q-ts-1",
      skillId: "skill-typescript",
      question: "What is the primary difference between 'type' and 'interface' in TypeScript regarding declaration merging?",
      options: [
        "Interfaces can be merged by redeclaring; type aliases cannot",
        "Type aliases support inheritance with extends; interfaces do not",
        "Interfaces cannot represent objects",
        "Type aliases cannot be exported"
      ],
      correctIndex: 0,
      explanation: "TypeScript interfaces support declaration merging where multiple declarations with the same name are merged into one."
    },
    {
      id: "q-ts-2",
      skillId: "skill-typescript",
      question: "What does the 'unknown' type represent in TypeScript compared to 'any'?",
      options: [
        "It disables all type checking completely like any",
        "It is the type-safe counterpart of any, requiring type narrowing before performing operations",
        "It represents void return values only",
        "It cannot be assigned to any variable"
      ],
      correctIndex: 1,
      explanation: "unknown is the type-safe counterpart of any; you cannot invoke or access properties on unknown without narrowing first."
    }
  ],
  "skill-postgres": [
    {
      id: "q-pg-1",
      skillId: "skill-postgres",
      question: "Which index type is the default and most commonly used for B-tree equality and range queries in PostgreSQL?",
      options: ["GIN", "GiST", "B-Tree", "BRIN"],
      correctIndex: 2,
      explanation: "B-Tree is the default PostgreSQL index structure ideal for sorting, comparisons (<, <=, =, >=, >), and equality."
    },
    {
      id: "q-pg-2",
      skillId: "skill-postgres",
      question: "In PostgreSQL Row Level Security (RLS), which SQL statement is used to turn on policy evaluation for a table?",
      options: [
        "GRANT RLS ON table_name TO authenticated;",
        "ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;",
        "CREATE SECURITY POLICY ON table_name;",
        "SET rls = true;"
      ],
      correctIndex: 1,
      explanation: "ALTER TABLE <name> ENABLE ROW LEVEL SECURITY activates policy checking for non-superuser connections."
    }
  ]
};

export class AssessmentEngine {
  public static gradeAttempt(
    studentId: string,
    skillId: string,
    submissions: { questionId: string; selectedIndex: number }[]
  ): AssessmentAttempt {
    const bank = MCQ_ASSESSMENT_BANK[skillId] || [];
    if (bank.length === 0) {
      throw new Error(`No assessment questions configured for skill ${skillId}`);
    }

    let correctCount = 0;
    const answers = submissions.map((sub) => {
      const q = bank.find((item) => item.id === sub.questionId);
      const isCorrect = q ? q.correctIndex === sub.selectedIndex : false;
      if (isCorrect) correctCount++;
      return {
        questionId: sub.questionId,
        selectedIndex: sub.selectedIndex,
        correct: isCorrect
      };
    });

    const score = Math.round((correctCount / bank.length) * 100);
    const passed = score >= 70;
    const proctoredId = `PROC-${skillId.toUpperCase().replace('SKILL-', '')}-${Date.now().toString(36).toUpperCase()}`;

    return {
      attemptId: `att-${Date.now()}`,
      studentId,
      skillId,
      score,
      passed,
      timestamp: new Date().toISOString(),
      answers,
      proctoredId
    };
  }
}
