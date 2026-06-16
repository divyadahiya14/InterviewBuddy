import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.AI_API_KEY;
const RESUME_API_KEY = process.env.AI_RESUME_API_KEY || '';
const API_URL = process.env.AI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

// Helper to extract JSON from markdown/raw text
const extractJson = (raw) => {
  if (!raw || !raw.trim()) return '';
  let cleaned = raw.trim();

  // Remove markdown formatting
  cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();

  const startArr = cleaned.indexOf('[');
  const startObj = cleaned.indexOf('{');

  let start = -1;
  let end = -1;

  if (startArr !== -1 && (startObj === -1 || startArr < startObj)) {
    start = startArr;
    end = cleaned.lastIndexOf(']');
  } else if (startObj !== -1) {
    start = startObj;
    end = cleaned.lastIndexOf('}');
  }

  if (start !== -1 && end !== -1 && end >= start) {
    return cleaned.substring(start, end + 1);
  }

  return cleaned;
};

// Raw call to Gemini API
export const callAI = async (prompt, useResumeKey = false) => {
  try {
    console.log('Calling Gemini API...');

    const partMap = { text: prompt };
    const contentMap = { parts: [partMap] };
    const payload = { contents: [contentMap] };

    let keyToUse = API_KEY;
    if (useResumeKey && RESUME_API_KEY.trim()) {
      keyToUse = RESUME_API_KEY;
      console.log('Using dedicated Resume API Key.');
    }

    const fullUrl = `${API_URL}?key=${keyToUse}`;

    const response = await axios.post(fullUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 90000 // 90 seconds timeout
    });

    const data = response.data;

    if (data.error) {
      const errorMessage = data.error.message;
      console.error('Gemini API error:', errorMessage);
      throw new Error(errorMessage);
    }

    if (data.candidates && data.candidates.length > 0) {
      const firstCandidate = data.candidates[0];
      const content = firstCandidate.content;
      if (content && content.parts && content.parts.length > 0) {
        return content.parts[0].text;
      }
    }

    throw new Error('Unexpected response format from Gemini');
  } catch (error) {
    console.error('Gemini connection failed:', error.message);
    throw new Error(`Gemini connection failed: ${error.message}`);
  }
};

// Fallbacks for DSA Practice
const fallbackHardQuestions = [
  {
    question: "Trapping Rain Water",
    statement: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    example1: { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
    example2: { input: "height = [4,2,0,3,2,5]", output: "9" },
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    starterCode: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = height.size() - 1;\n        int ans = 0, left_max = 0, right_max = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                height[l] >= left_max ? left_max = height[l] : ans += (left_max - height[l]);\n                l++;\n            } else {\n                height[r] >= right_max ? right_max = height[r] : ans += (right_max - height[r]);\n                r--;\n            }\n        }\n        return ans;\n    }\n};"
  },
  {
    question: "Median of Two Sorted Arrays",
    statement: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    example1: { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
    example2: { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" },
    constraints: ["nums1.length == m", "nums2.length == n", "0 <= m, n <= 1000", "1 <= m + n <= 2000"],
    starterCode: "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution"
  },
  {
    question: "Merge k Sorted Lists",
    statement: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    example1: { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
    example2: { input: "lists = []", output: "[]" },
    constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "lists[i] is sorted in ascending order."],
    starterCode: "class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution"
  },
  {
    question: "Edit Distance",
    statement: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the operations: Insert, Delete, Replace.",
    example1: { input: "word1 = \"horse\", word2 = \"ros\"", output: "3" },
    example2: { input: "word1 = \"intention\", word2 = \"execution\"", output: "5" },
    constraints: ["0 <= word1.length, word2.length <= 500", "word1 and word2 consist of lowercase English letters."],
    starterCode: "class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution"
  }
];

const fallbackMediumQuestions = [
  {
    question: "Container With Most Water",
    statement: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    example1: { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
    example2: { input: "height = [1,1]", output: "1" },
    constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    starterCode: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution"
  },
  {
    question: "3Sum",
    statement: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    example1: { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
    example2: { input: "nums = [0,1,1]", output: "[]" },
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    starterCode: "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution"
  },
  {
    question: "Longest Substring Without Repeating Characters",
    statement: "Given a string s, find the length of the longest substring without repeating characters.",
    example1: { input: "s = \"abcabcbb\"", output: "3" },
    example2: { input: "s = \"bbbbb\"", output: "1" },
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    starterCode: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution"
  }
];

const fallbackEasyQuestions = [
  {
    question: "Two Sum",
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example1: { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
    example2: { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    starterCode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution"
  },
  {
    question: "Contains Duplicate",
    statement: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    example1: { input: "nums = [1,2,3,1]", output: "true" },
    example2: { input: "nums = [1,2,3,4]", output: "false" },
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    starterCode: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution"
  },
  {
    question: "Valid Parentheses",
    statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    example1: { input: "s = \"()\"", output: "true" },
    example2: { input: "s = \"()[]{}\"", output: "true" },
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only"],
    starterCode: "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};",
    expectedSolution: "// C++ Solution"
  }
];

export const generateQuestion = async (type, level) => {
  const normType = type ? type.trim().toUpperCase() : 'DSA';
  const normLevel = level ? level.trim().toLowerCase() : 'easy';

  const prompt = `Generate ONE DSA interview question in STRICT JSON format.
Rules:
- Only return raw JSON (NO markdown, NO \`\`\`)
- Exactly 2 examples
- Must include constraints
- Level: ${level}

Format:
{
  "question": "Short Title",
  "statement": "Detailed problem description...",
  "example1": { "input": "", "output": "" },
  "example2": { "input": "", "output": "" },
  "constraints": ["", ""],
  "starterCode": "// Provide a SPECIFIC function signature here that matches the problem's needs (e.g. 'int countEven(vector<int>& nums) { }'). Do NOT just give a generic solve() function.",
  "expectedSolution": "// Write the COMPLETE optimal C++ solution function here"
}`;

  try {
    const aiResponse = await callAI(prompt);
    const clean = extractJson(aiResponse);
    return JSON.parse(clean);
  } catch (error) {
    console.error('DSA Question generation failed, returning fallback:', error.message);
    let pool = fallbackEasyQuestions;
    if (normLevel === 'hard') pool = fallbackHardQuestions;
    else if (normLevel === 'medium') pool = fallbackMediumQuestions;

    const randIdx = Math.floor(Math.random() * pool.length);
    return pool[randIdx];
  }
};

export const generateAIMLQuestion = async (type, level) => {
  const prompt = `Generate ONE AI/ML interview question in STRICT JSON format.
Rules:
- Only return raw JSON (NO markdown, NO \`\`\`)
- Question must be related to AI/ML concepts OR ML coding (Python preferred)
- Include real-world ML scenario (like dataset, model, prediction, etc.)
- Exactly 2 examples
- Must include constraints
- Level: ${level}

Focus areas:
- Machine Learning (regression, classification)
- Data preprocessing
- NumPy / Pandas problems
- Simple ML logic / pseudo training

Format:
{
  "question": "Short Title",
  "statement": "Detailed problem description...",
  "example1": { "input": "", "output": "" },
  "example2": { "input": "", "output": "" },
  "constraints": ["", ""],
  "starterCode": "# Provide a SPECIFIC Python function signature (e.g. 'def normalize_data(data):')",
  "expectedSolution": "# Write the COMPLETE optimal Python solution function here"
}`;

  try {
    const aiResponse = await callAI(prompt);
    const clean = extractJson(aiResponse);
    return JSON.parse(clean);
  } catch (error) {
    console.error('AI/ML Question generation failed, returning fallback:', error.message);
    return {
      question: "Feature Scaling for Model Training",
      statement: "Implement a function that performs Min-Max normalization on a 1D list of numerical features. The output should be values between 0 and 1.",
      example1: { input: "features = [10, 20, 30, 40, 50]", output: "[0.0, 0.25, 0.5, 0.75, 1.0]" },
      example2: { input: "features = [1, 2, 3]", output: "[0.0, 0.5, 1.0]" },
      constraints: ["1 <= len(features) <= 1000", "Min and Max are not equal"],
      starterCode: "def normalize_data(features):\n    pass",
      expectedSolution: "def normalize_data(features):\n    mn = min(features)\n    mx = max(features)\n    return [(x - mn) / (mx - mn) for x in features]"
    };
  }
};

export const generateDBQuestion = async (type, level) => {
  const prompt = `Generate ONE SQL-based AI/ML interview question in STRICT JSON format.

Rules:
- Only return raw JSON (NO markdown, NO \`\`\`)
- The question MUST be a SQL query problem
- Focus on database operations used in ML pipelines (feature extraction, aggregation, filtering, joins)
- Real-world scenario should involve data like customers, sales, transactions, logs, or predictions
- Exactly 2 examples (input-output style)
- Must include constraints
- Level: ${level}

Focus areas:
- SQL queries for ML datasets
- Aggregations (AVG, SUM, COUNT)
- Joins between tables
- Filtering based on conditions
- Feature engineering using SQL

Format:
{
  "question": "Short Title",
  "statement": "Write an SQL query ...",
  "example1": { "input": "", "output": "" },
  "example2": { "input": "", "output": "" },
  "constraints": ["", ""],
  "starterCode": "-- Write a specific SQL query template here",
  "expectedSolution": "-- Write the COMPLETE optimal SQL query here"
}`;

  try {
    const aiResponse = await callAI(prompt);
    const clean = extractJson(aiResponse);
    return JSON.parse(clean);
  } catch (error) {
    console.error('DB Question generation failed, returning fallback:', error.message);
    return {
      question: "Top N High-Value Customers",
      statement: "Write a SQL query to find the names of the top 3 customers who have spent the most money. Assume tables 'Customers' (id, name) and 'Orders' (id, customer_id, amount).",
      example1: { input: "Customers = [(1,'A'),(2,'B')], Orders = [(1,1,100),(2,1,200)]", output: "Customer A, total 300" },
      example2: { input: "Customers = [(1,'A')], Orders = []", output: "No results" },
      constraints: ["Return names and total amount spent", "Order by amount DESC"],
      starterCode: "SELECT ...",
      expectedSolution: "SELECT c.name, SUM(o.amount) AS total_spent\nFROM Customers c\nJOIN Orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name\nORDER BY total_spent DESC\nLIMIT 3;"
    };
  }
};

export const evaluateAnswer = async (question, code, language) => {
  const prompt = `You are a STRICT ONLINE JUDGE like LeetCode.

================ INPUTS ================
LANGUAGE:
${language}

QUESTION:
${question}

USER CODE:
${code}

================ STRICT RULES ================
1. Use ONLY given language: ${language}
2. DO NOT convert language
3. DO NOT fix or complete code
4. If code incomplete → COMPILE_ERROR
5. If syntax wrong → COMPILE_ERROR
6. If runtime crash possible → RUNTIME_ERROR
7. If logic incorrect → WRONG_ANSWER

================ EXECUTION ================
- Simulate execution on multiple test cases
- Include edge cases:
  empty input, single element, duplicates, negatives, large input

================ FINAL OUTPUT (STRICT) ================
Return EXACTLY in this format:
{
  "status": "COMPILE_ERROR | RUNTIME_ERROR | WRONG_ANSWER | PARTIAL_PASS | ACCEPTED",
  "passed": true/false,
  "message": "short reason (max 1 line)"
}

================ IMPORTANT ================
- NO explanation
- NO code suggestion
- ONLY JSON output`;

  try {
    const aiResponse = await callAI(prompt);
    return extractJson(aiResponse);
  } catch (error) {
    console.error('Evaluation failed:', error.message);
    return JSON.stringify({
      status: 'SERVER_ERROR',
      passed: false,
      message: 'AI service temporarily unavailable. Please try again.'
    });
  }
};

export const generateFeedback = async (question, code, language) => {
  const prompt = `You are a STRICT code evaluator used in an online coding platform like LeetCode.

LANGUAGE:
${language}

QUESTION:
${question}

CODE:
${code}

CRITICAL RULE (VERY IMPORTANT):
Before doing ANY analysis, first check if the code is valid programming code.
Valid code means:
- It must contain meaningful programming syntax
- It must not be random characters or gibberish
- It must be related to the question

IF CODE IS INVALID / RANDOM / NON-CODE:
- timeComplexity = ""
- spaceComplexity = ""
- codeQuality = "Poor"
- score = 0
- feedback = "Invalid or non-compilable / meaningless code. Please write proper solution."
STOP HERE. DO NOT DO ANY FURTHER ANALYSIS.

IF CODE IS VALID:
Step 1: Classify PASS or FAIL logically

PASS:
- timeComplexity
- spaceComplexity
- codeQuality (Bad/Average/Good/Excellent)
- score (0-100)
- feedback: 1-2 lines improvement suggestion only

FAIL (but valid code):
- Identify logic issues
- Give hint or correction (max 2 lines)
- DO NOT give TC/SC
- score must be <= 40

STRICT OUTPUT FORMAT:
Return ONLY valid JSON. No markdown, no explanation.
{
  "timeComplexity": "",
  "spaceComplexity": "",
  "codeQuality": "",
  "score": 0,
  "feedback": ""
}`;

  try {
    const aiResponse = await callAI(prompt);
    return extractJson(aiResponse);
  } catch (error) {
    console.error('Feedback generation failed:', error.message);
    return JSON.stringify({
      timeComplexity: '-',
      spaceComplexity: '-',
      codeQuality: 'Error',
      score: 0,
      feedback: 'AI service busy (Rate Limit). Please retry in 10s.'
    });
  }
};

export const generateTheoryQuestions = async (type, level) => {
  let normalizedType = type ? type.toLowerCase() : 'fundamentals';
  if (normalizedType.includes('web')) normalizedType = 'web';
  if (normalizedType.includes('ai')) normalizedType = 'ai-ml';
  if (normalizedType.includes('db')) normalizedType = 'dbms';
  if (normalizedType.includes('fund')) normalizedType = 'fundamentals';

  const prompt = `You are an expert interview question generator.
Generate exactly 10 HIGH-QUALITY interview theory questions.

RULES:
- Questions must STRICTLY belong to the given domain only
- Do NOT mix topics from other domains
- Return ONLY a JSON array of strings
- No explanation, no numbering, no markdown

DOMAIN RULES:
- If type = fundamentals → include OOPS, DBMS, OS, CN basics (balanced mix)
- If type = web → include HTML, CSS, JavaScript, React, Tailwind, frontend concepts only
- If type = dsa → include algorithms, arrays, trees, sorting, complexity
- If type = dbms → include SQL, normalization, joins, indexing, transactions
- If type = ai-ml → include ML concepts, models, training, evaluation

LEVEL: ${level}
TYPE: ${normalizedType}

OUTPUT FORMAT:
["question1", "question2", ...]`;

  try {
    const aiResponse = await callAI(prompt);
    const clean = extractJson(aiResponse);
    return JSON.parse(clean);
  } catch (error) {
    console.error('AI Theory questions generation failed, returning fallback:', error.message);
    return [
      "Explain the difference between a process and a thread.",
      "What is polymorphism in OOP?",
      "How does the Internet Protocol (IP) work?",
      "What are the ACID properties in a database?",
      "Explain the concept of Big O notation."
    ];
  }
};

export const evaluateTheory = async (request) => {
  const prompt = `You are an expert interview evaluator.

TASK:
Evaluate each answer corresponding to its question.

VERY STRICT RULES:
1. Evaluate answers ONE BY ONE in order
2. Each answer MUST match the same index question
3. If answer is empty, null, or irrelevant → score = 0
4. If answer is correct or mostly correct → score = 1
5. DO NOT randomly generate scores
6. Output scores array length MUST be exactly equal to number of questions
7. Maintain order strictly (Q1→A1, Q2→A2, ...)

SCORING:
- score = (number of correct answers / total questions) * 100

INPUT DATA:
TYPE: ${request.type}
LEVEL: ${request.level}

QUESTIONS:
${JSON.stringify(request.questions)}

ANSWERS:
${JSON.stringify(request.answers)}

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "score": 0,
  "feedback": "short overall feedback",
  "scores": [0,1,1,0,1,0,1,1,0,1]
}

IMPORTANT:
- Do NOT skip any question
- Do NOT change order
- Do NOT give extra text`;

  try {
    const aiResponse = await callAI(prompt);
    const clean = extractJson(aiResponse);
    return JSON.parse(clean);
  } catch (error) {
    console.error('Theory evaluation failed:', error.message);
    return {
      score: 0,
      feedback: 'Evaluation service temporarily unavailable. Please try again later.',
      scores: new Array(request.questions.length).fill(0)
    };
  }
};

export const generateHint = async (question, code, language) => {
  const prompt = `You are a technical coding interviewer helping a candidate.
Analyze the problem and the user's code, then give a small helpful hint.

Rules:
- Do NOT give full solution
- Do NOT give code
- Keep the hint within 1-2 lines
- Be simple and beginner-friendly
- Hint must be relevant to the given problem
- Focus on what the user is missing or doing wrong

Problem:
${question}

Programming Language:
${language}

User Code:
${code}

Output:
Only return the hint text. No JSON. No explanation.`;

  try {
    const response = await callAI(prompt);
    if (!response || !response.trim()) {
      return 'Try breaking problem into smaller steps.';
    }
    return response.trim();
  } catch (error) {
    console.error('Hint failed:', error.message);
    if (error.message.includes('rate-limited')) {
      return '⚠️ AI is temporarily busy (rate-limited). Please wait 10 seconds and try again.';
    }
    return '⚠️ Hint not available right now. Please try after some time.';
  }
};
