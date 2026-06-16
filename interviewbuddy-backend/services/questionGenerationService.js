import { callAI } from './aiService.js';
import Resume from '../models/Resume.js';

const getFallbackGeneralQuestion = (index) => {
  const fallbackQs = [
    "Describe a challenging technical project you worked on and how you resolved the obstacles.",
    "How do you handle technical disagreements within a team or with a product manager?",
    "Tell me about a time you had to learn a new technology or framework quickly for a project.",
    "How do you prioritize your tasks when working on multiple high-priority deliverables?",
    "Describe a time you made a technical mistake or decision that had negative consequences, and what you learned from it.",
    "What is your approach to ensuring code quality and maintainability in a team setting?",
    "Can you explain a complex technical concept or architecture you recently designed to a non-technical stakeholder?"
  ];
  if (index >= 0 && index < fallbackQs.length) {
    return fallbackQs[index];
  }
  return "Can you tell me about your experience working with teams on complex projects?";
};

const getPremiumFallbackQuestions = (resume) => {
  const result = [];
  const skillsStr = resume.skills ? resume.skills.toLowerCase() : '';

  const pool = {
    java: [
      "Explain the difference between JVM, JRE, and JDK, and how classloading works.",
      "What is the difference between HashMap and ConcurrentHashMap in Java, and how does it ensure thread safety?",
      "How does garbage collection work in Java, and what are the key differences between G1 and ZGC algorithms?",
      "Explain Java's Stream API: how do intermediate operations differ from terminal operations in terms of execution?",
      "What is the difference between an interface and an abstract class in Java 8 and beyond?"
    ],
    "spring boot": [
      "What is Dependency Injection (DI) and Inversion of Control (IoC) in the Spring Framework, and how do they decouple components?",
      "Explain the difference between @Component, @Service, @Repository, and @Controller annotations.",
      "How does Spring Boot's auto-configuration work under the hood using @EnableAutoConfiguration?",
      "Explain the lifecycle of a Spring Bean, and how we can customize bean initialization and destruction.",
      "What is Spring Security, and how does token-based (JWT) authentication work in a stateless REST API?"
    ],
    spring: [
      "What is Dependency Injection (DI) and Inversion of Control (IoC) in the Spring Framework?",
      "Explain bean scopes in Spring (Singleton, Prototype, Request, Session) and their use cases.",
      "How does Spring handle database transaction management via the @Transactional annotation?",
      "What is Aspect-Oriented Programming (AOP) in Spring and how does it help with cross-cutting concerns?"
    ],
    react: [
      "What is the Virtual DOM and how does React's reconciliation/diffing process work?",
      "Explain the difference between React class components and functional components, and why hooks were introduced.",
      "How does the useEffect cleanup function work, and exactly when is it executed?",
      "Explain state management options in React, and when you would prefer Context API over Redux or Recoil.",
      "What are React Server Components and how do they differ from standard client-side components?"
    ],
    angular: [
      "What is change detection in Angular, and how does OnPush change detection strategy improve performance?",
      "Explain the difference between Directives and Components in Angular, and name the three types of directives.",
      "How does dependency injection work in Angular, and what is the difference between providing a service in root vs component level?",
      "What are RxJS Observables, and how do they differ from Promises in handling async data streams?",
      "Explain Angular routing, including lazy loading and route guards."
    ],
    vue: [
      "Explain the reactivity system in Vue 3 (Proxy-based) compared to Vue 2 (Object.defineProperty).",
      "What is the Vue Composition API, and how does it compare to the Options API?",
      "What are computed properties in Vue, and how do they differ from methods?",
      "Explain how component communication works in Vue using props and custom events.",
      "What is Vuex / Pinia and when should you use it for state management?"
    ],
    javascript: [
      "What is the event loop in JavaScript, and how does it handle the call stack, microtasks, and macrotasks?",
      "Explain the difference between var, let, and const, and the concept of hoisting and block scoping.",
      "What are closures in JavaScript, and what is a practical, real-world use case for them?",
      "Explain the prototype-based inheritance model in JavaScript.",
      "What is the difference between double equals (==) and triple equals (===) operators?"
    ],
    typescript: [
      "Explain the difference between TypeScript interface and type alias, and when to use each.",
      "What are generics in TypeScript and how do they help write reusable, type-safe components?",
      "What is structural typing in TypeScript and how does it differ from nominal typing?",
      "Explain utility types in TypeScript, such as Partial, Omit, Readonly, and Record.",
      "What are Union and Intersection types, and how do you perform type narrowing?"
    ],
    python: [
      "What is the difference between a list and a tuple in Python, and when is a tuple preferred?",
      "Explain Python's GIL (Global Interpreter Lock) and how it affects multi-threaded CPU-bound programs.",
      "How do decorators work in Python? Write a simple execution-time logging decorator concept.",
      "What is the difference between deep copy and shallow copy in Python?",
      "Explain list comprehensions, generators, and how the yield keyword works in Python."
    ],
    sql: [
      "What are the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN?",
      "Explain database normalization up to 3NF and why denormalization might be used in production.",
      "What are indexes in a database, and how do B-Tree indexes improve query performance?",
      "Explain the ACID properties in DBMS and how database systems guarantee transaction integrity.",
      "What is the difference between clustered and non-clustered indexes?"
    ],
    mysql: [
      "What are the differences between InnoDB and MyISAM storage engines in MySQL?",
      "How do you optimize a slow-running SELECT query in MySQL?",
      "Explain replication in MySQL (Master-Slave, Multi-Master) and its benefits.",
      "What is the difference between CHAR and VARCHAR data types in MySQL?"
    ],
    postgresql: [
      "What is Multi-Version Concurrency Control (MVCC) in PostgreSQL and how does it handle locks?",
      "What is EXPLAIN ANALYZE in PostgreSQL and how do you read its output to optimize queries?",
      "Explain the difference between JSON and JSONB data types in PostgreSQL.",
      "How do common table expressions (CTEs) and recursive queries work in PostgreSQL?"
    ],
    mongodb: [
      "How does MongoDB's document-based model differ from relational databases, and when should you choose SQL vs NoSQL?",
      "Explain embedding vs referencing documents in MongoDB schema design.",
      "What is the aggregation framework in MongoDB, and how do $match, $group, and $project stages work?",
      "Explain indexing in MongoDB, including single field, compound, and multikey indexes."
    ],
    docker: [
      "What is the difference between a Docker container and a Virtual Machine?",
      "How does a Dockerfile multi-stage build work, and why is it useful for production builds?",
      "Explain Docker networking modes (bridge, host, none, overlay).",
      "What is a Docker volume, and how does it differ from a bind mount?"
    ],
    kubernetes: [
      "What is a Pod in Kubernetes, and why can it contain multiple containers?",
      "Explain the architecture of Kubernetes, listing its main control plane and worker node components.",
      "What is the difference between a Deployment, a StatefulSet, and a DaemonSet in Kubernetes?",
      "How does Kubernetes service discovery and load balancing work under the hood?"
    ],
    devops: [
      "What is Infrastructure as Code (IaC) and what are its main advantages?",
      "Explain the concept of CI/CD, and what are the benefits of integrating automated testing into a CI/CD pipeline?",
      "How do blue-green deployments differ from canary deployments?",
      "What is GitOps and how does it manage infrastructure and application state?"
    ]
  };

  const generalPool = [
    "Describe a challenging technical project you worked on and how you resolved the obstacles.",
    "How do you handle technical disagreements within a team or with a product manager?",
    "Tell me about a time you had to learn a new technology or framework quickly for a project.",
    "How do you prioritize your tasks when working on multiple high-priority deliverables?",
    "Describe a time you made a technical mistake or decision that had negative consequences, and what you learned from it.",
    "What is your approach to ensuring code quality and maintainability in a team setting?",
    "Can you explain a complex technical concept or architecture you recently designed to a non-technical stakeholder?"
  ];

  const selectedQuestions = new Set();

  for (const [skill, questions] of Object.entries(pool)) {
    if (skillsStr.includes(skill)) {
      // Pick up to 2 random questions from this skill pool
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      for (let i = 0; i < Math.min(2, shuffled.length); i++) {
        selectedQuestions.add(shuffled[i]);
      }
    }
  }

  result.push(...selectedQuestions);

  // If not enough questions, backfill from general pool
  if (result.length < 7) {
    const shuffledGeneral = [...generalPool].sort(() => 0.5 - Math.random());
    for (const gQ of shuffledGeneral) {
      if (result.length >= 7) break;
      result.push(gQ);
    }
  }

  // If too many questions, shuffle and pick exactly 7
  if (result.length > 7) {
    const shuffledResult = [...result].sort(() => 0.5 - Math.random());
    return shuffledResult.slice(0, 7);
  }

  return result;
};

const cleanJson = (raw) => {
  if (!raw || !raw.trim()) return '[]';
  let cleaned = raw.trim();

  // Remove markdown formatting
  cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();

  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');

  if (start !== -1 && end !== -1 && end >= start) {
    return cleaned.substring(start, end + 1);
  }

  return cleaned;
};

export const generateQuestions = async (resume) => {
  // If we already have cached questions, return them!
  if (resume.generatedQuestions && resume.generatedQuestions.trim()) {
    try {
      return JSON.parse(resume.generatedQuestions);
    } catch (e) {
      console.error('Failed to read cached questions:', e.message);
    }
  }

  let questions = [];

  const prompt = `You are an expert technical interviewer.
Generate exactly 7 highly personalized technical and situational/behavioral interview questions for a candidate based on their resume profile.

Candidate Skills:
${resume.skills || 'Not specified'}

Resume Text Context (first 3000 chars):
${resume.parsedText ? resume.parsedText.substring(0, 3000) : 'Not specified'}

STRICT RULES:
1. Generate EXACTLY 7 questions.
2. Ensure approximately 4 to 5 questions are directly based on the projects and experience in their resume, and 2 to 3 questions strictly focus on testing the core skills they mentioned.
3. Return the response in STRICT JSON format: a JSON array of strings, containing exactly 7 elements.
4. Example output format:
[
  "Question 1 here?",
  "Question 2 here?",
  "Question 3 here?",
  "Question 4 here?",
  "Question 5 here?",
  "Question 6 here?",
  "Question 7 here?"
]
5. Do not include markdown formatting (like \`\`\`json), intro text, or explanation. Only return the raw JSON array.`;

  try {
    const aiResponse = await callAI(prompt, true);
    console.log('Gemini resume questions raw response:', aiResponse);

    const json = cleanJson(aiResponse);
    questions = JSON.parse(json);

    if (!questions || questions.length === 0) {
      throw new Error('Empty or invalid questions array from AI.');
    }

    // Adjust to exactly 5 questions (matching Spring Boot success logic)
    if (questions.length !== 5) {
      console.log(`AI returned ${questions.length} questions instead of 5. Adjusting...`);
      while (questions.length > 5) {
        questions.pop();
      }
      while (questions.length < 5) {
        questions.push(getFallbackGeneralQuestion(questions.length));
      }
    }
  } catch (error) {
    console.error('AI resume question generation failed or rate limited. Using premium fallback pool:', error.message);
    questions = getPremiumFallbackQuestions(resume);
  }

  // Save generated questions back to Resume to cache them
  try {
    resume.generatedQuestions = JSON.stringify(questions);
    await resume.save();
  } catch (error) {
    console.error('Failed to cache questions into database:', error.message);
  }

  return questions;
};
