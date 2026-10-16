/**
 * ProofHire Canonical Skill Catalogue
 * Token-aware matching, alias dictionary, category mapping.
 */

export interface CanonicalSkill {
  id: string;
  canonicalName: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai_ml' | 'languages' | 'fundamentals' | 'mobile';
  aliases: string[];
  description: string;
}

export const SKILL_CATALOGUE: CanonicalSkill[] = [
  // Frontend
  {
    id: "skill-react",
    canonicalName: "React",
    category: "frontend",
    aliases: ["react", "reactjs", "react.js", "react js", "react native"],
    description: "Component-based declarative UI library for modern web applications."
  },
  {
    id: "skill-typescript",
    canonicalName: "TypeScript",
    category: "languages",
    aliases: ["typescript", "ts", "type script"],
    description: "Strict syntactical superset of JavaScript providing static typing."
  },
  {
    id: "skill-javascript",
    canonicalName: "JavaScript",
    category: "languages",
    aliases: ["javascript", "js", "ecmascript", "es6", "es6+", "es2020"],
    description: "High-level, interpreted scripting language of the web."
  },
  {
    id: "skill-html",
    canonicalName: "HTML",
    category: "frontend",
    aliases: ["html", "html5", "semantic html"],
    description: "Standard markup language for documents designed to be displayed in a browser."
  },
  {
    id: "skill-css",
    canonicalName: "CSS",
    category: "frontend",
    aliases: ["css", "css3", "vanilla css", "stylesheets"],
    description: "Style sheet language used for specifying presentation of structured documents."
  },
  {
    id: "skill-tailwind",
    canonicalName: "Tailwind CSS",
    category: "frontend",
    aliases: ["tailwind", "tailwindcss", "tailwind-css"],
    description: "Utility-first CSS framework for rapid modern UI development."
  },
  {
    id: "skill-vue",
    canonicalName: "Vue.js",
    category: "frontend",
    aliases: ["vue", "vuejs", "vue.js", "vue 3", "vue2"],
    description: "Progressive JavaScript framework for building user interfaces."
  },
  {
    id: "skill-angular",
    canonicalName: "Angular",
    category: "frontend",
    aliases: ["angular", "angularjs", "angular 2+"],
    description: "TypeScript-based open-source web application framework."
  },
  {
    id: "skill-nextjs",
    canonicalName: "Next.js",
    category: "frontend",
    aliases: ["nextjs", "next.js", "next js"],
    description: "React framework for production with server-side rendering and static export."
  },

  // Backend & Languages
  {
    id: "skill-nodejs",
    canonicalName: "Node.js",
    category: "backend",
    aliases: ["nodejs", "node.js", "node js", "node"],
    description: "Asynchronous event-driven JavaScript runtime environment."
  },
  {
    id: "skill-express",
    canonicalName: "Express",
    category: "backend",
    aliases: ["express", "expressjs", "express.js", "express js"],
    description: "Minimalist web framework for Node.js applications."
  },
  {
    id: "skill-python",
    canonicalName: "Python",
    category: "languages",
    aliases: ["python", "python3", "py"],
    description: "High-level programming language emphasizing code readability."
  },
  {
    id: "skill-java",
    canonicalName: "Java",
    category: "languages",
    aliases: ["java", "core java", "java 17", "java 21", "j2se"],
    description: "Object-oriented, class-based programming language."
  },
  {
    id: "skill-cpp",
    canonicalName: "C++",
    category: "languages",
    aliases: ["c++", "cpp"],
    description: "High-performance general-purpose programming language."
  },
  {
    id: "skill-golang",
    canonicalName: "Go",
    category: "languages",
    aliases: ["go", "golang"],
    description: "Statically typed, compiled language engineered by Google."
  },
  {
    id: "skill-rest-api",
    canonicalName: "REST APIs",
    category: "backend",
    aliases: ["rest", "restful", "rest api", "rest apis", "restful api", "restful apis"],
    description: "Representational State Transfer architectural style for networked APIs."
  },
  {
    id: "skill-graphql",
    canonicalName: "GraphQL",
    category: "backend",
    aliases: ["graphql", "gql"],
    description: "Query language for APIs and runtime for fulfilling queries with existing data."
  },

  // Databases
  {
    id: "skill-postgres",
    canonicalName: "PostgreSQL",
    category: "database",
    aliases: ["postgres", "postgresql", "pg", "psql"],
    description: "Powerful, open source object-relational database system."
  },
  {
    id: "skill-mysql",
    canonicalName: "MySQL",
    category: "database",
    aliases: ["mysql", "my-sql"],
    description: "Open-source relational database management system."
  },
  {
    id: "skill-mongodb",
    canonicalName: "MongoDB",
    category: "database",
    aliases: ["mongodb", "mongo"],
    description: "Document-oriented NoSQL database system."
  },
  {
    id: "skill-redis",
    canonicalName: "Redis",
    category: "database",
    aliases: ["redis", "in-memory cache"],
    description: "In-memory data structure store used as a database, cache, and message broker."
  },
  {
    id: "skill-sql",
    canonicalName: "SQL",
    category: "database",
    aliases: ["sql", "rdbms", "relational databases", "advanced sql", "postgresql optimization"],
    description: "Standard language for storing, manipulating and retrieving data in relational databases."
  },

  // DevOps & Cloud
  {
    id: "skill-git",
    canonicalName: "Git",
    category: "devops",
    aliases: ["git", "github", "gitlab", "version control"],
    description: "Distributed version control system for tracking changes in source code."
  },
  {
    id: "skill-docker",
    canonicalName: "Docker",
    category: "devops",
    aliases: ["docker", "containerization", "containers"],
    description: "Set of platform as a service products using OS-level virtualization."
  },
  {
    id: "skill-kubernetes",
    canonicalName: "Kubernetes",
    category: "devops",
    aliases: ["kubernetes", "k8s"],
    description: "Open-source container orchestration system for automating application deployment."
  },
  {
    id: "skill-aws",
    canonicalName: "AWS",
    category: "devops",
    aliases: ["aws", "amazon web services", "cloud computing"],
    description: "Cloud computing platform provided by Amazon."
  },

  // CS Fundamentals
  {
    id: "skill-dsa",
    canonicalName: "Data Structures & Algorithms",
    category: "fundamentals",
    aliases: ["dsa", "data structures", "algorithms", "data structures and algorithms", "algorithmic problem solving"],
    description: "Fundamental computer science foundations of data organization and algorithm complexity."
  },
  {
    id: "skill-system-design",
    canonicalName: "System Design",
    category: "fundamentals",
    aliases: ["system design", "distributed systems", "microservices architecture", "systems architecture"],
    description: "Process of defining the architecture, components, modules, and interfaces for a system."
  }
];

// Inverted lookup map for O(1) alias matching
const ALIAS_MAP = new Map<string, CanonicalSkill>();

SKILL_CATALOGUE.forEach((skill) => {
  // Map canonical name lowercased
  ALIAS_MAP.set(skill.canonicalName.toLowerCase(), skill);
  // Map aliases
  skill.aliases.forEach((alias) => {
    ALIAS_MAP.set(alias.toLowerCase(), skill);
  });
});

/**
 * Normalizes a raw skill string to its CanonicalSkill record.
 * Uses exact token/alias comparison to prevent unsafe substring match (e.g. "Java" vs "JavaScript").
 */
export function normalizeSkill(rawSkill: string): CanonicalSkill | null {
  if (!rawSkill || typeof rawSkill !== 'string') return null;
  const cleaned = rawSkill.trim().toLowerCase();
  if (ALIAS_MAP.has(cleaned)) {
    return ALIAS_MAP.get(cleaned)!;
  }
  // Remove non-alphanumeric punctuation except dot, plus, hash (e.g., c++, c#, .net)
  const punctuationNormalized = cleaned.replace(/[^\w\s.+#-]/g, '').trim();
  if (ALIAS_MAP.has(punctuationNormalized)) {
    return ALIAS_MAP.get(punctuationNormalized)!;
  }
  return null;
}

/**
 * Extract canonical skills from a free-text block (such as a JD or resume bullet).
 * Token-aware scanning that respects multi-word tokens and avoids false positives like 'Java' in 'JavaScript'.
 */
export function extractSkillsFromText(text: string): { skill: CanonicalSkill; matchedText: string }[] {
  if (!text || typeof text !== 'string') return [];
  const results = new Map<string, { skill: CanonicalSkill; matchedText: string }>();

  // Sort aliases by length descending so longer tokens match first ("react native" before "react")
  const sortedEntries = Array.from(ALIAS_MAP.entries()).sort((a, b) => b[0].length - a[0].length);

  for (const [alias, skill] of sortedEntries) {
    if (results.has(skill.id)) continue; // Already found this canonical skill

    // Token-aware regex with word boundaries.
    // Handles punctuation like C++ or .js safely
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s,;()/\\[\\]{}:.-])${escaped}(?=[\\s,;()/\\[\\]{}:.-]|$)`, 'i');

    const match = text.match(regex);
    if (match) {
      results.set(skill.id, {
        skill,
        matchedText: match[0].trim()
      });
    }
  }

  return Array.from(results.values());
}
