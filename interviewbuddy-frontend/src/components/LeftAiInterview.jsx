// import { useEffect, useState } from "react";
// import axios from "axios";
// import API from "../services/api";

// function LeftAiInterview({ type , level , onTimeUp }) {
//   const [data, setData] = useState(null);
//   const [speaking, setSpeaking] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(40 * 60);

//   // =========================
//   // ⏱ TIMER
//   // =========================
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           alert("⏱ Time Over!");
//           onTimeUp && onTimeUp();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const formatTime = () => {
//     const min = Math.floor(timeLeft / 60);
//     const sec = timeLeft % 60;
//     return `${min}:${sec < 10 ? "0" : ""}${sec}`;
//   };

//   // =========================
//   // 🔊 SPEAK FUNCTION
//   // =========================
//   const speakText = (text) => {
//     if (!text) return;

//     window.speechSynthesis.cancel(); // avoid overlap

//     const speech = new SpeechSynthesisUtterance(text);
//     speech.rate = 0.9;

//     setSpeaking(true);

//     speech.onend = () => setSpeaking(false);

//     window.speechSynthesis.speak(speech);
//   };

//   const speak = () => {
//     speakText(data?.statement);
//   };

//   const stopSpeak = () => {
//     window.speechSynthesis.cancel();
//     setSpeaking(false);
//   };

//   // =========================
//   // 📡 FETCH QUESTION API
//   // =========================
//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         const res = await API.get(
//           "/ai/interview/question",
//           {
//             params: {
//   type: type?.toUpperCase() || "DSA",
//   level: level?.toLowerCase() || "easy",
// },
//           }
//         );

//         setData(res.data);
//         sessionStorage.setItem(
//   `${type}_${level}_question`,
//   JSON.stringify(res.data)
// );
//       } catch (err) {
//         console.log("Error:", err.message);
//       }
//     };

//     fetchQuestion();
//   }, [type, level]);

//   // =========================
//   // 🔥 AUTO SPEAK (NEW)
//   // =========================
//   useEffect(() => {
//     if (data?.statement) {
//       const timer = setTimeout(() => {
//         speakText(data.statement);
//       }, 500); // small delay for smooth UX

//       return () => clearTimeout(timer);
//     }
//   }, [data]);

//   return (
//     <div style={styles.left}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         {/* AI INTERVIEWER */}
//         <h2 style={styles.titleHeader}>AI Interviewer</h2>

//         {/* CONTROLS (NO EXTRA SPACE WITH TITLE) */}
//         <div style={styles.controls}>
//           <button onClick={speak} style={styles.iconBtn}>🔊</button>
//           <button onClick={stopSpeak} style={styles.iconBtn}>⏹</button>
//         </div>

//         {/* TIMER */}
//         <span style={styles.timer}>{formatTime()}</span>
//       </div>

//       {/* LOADING */}
//       {!data ? (
//         <div>Loading question...</div>
//       ) : (
//         <>
//           {/* QUESTION TITLE (SPACE HERE ADDED) */}
//           <div style={styles.questionTitle}>{data.question}</div>

//           {/* PROBLEM */}
//           <div style={styles.block}>
//             <h4>Problem</h4>
//             <p>{data.statement}</p>
//           </div>

//           {/* EXAMPLE 1 */}
//           <div style={styles.block}>
//             <h4>Example 1</h4>
//             <pre style={styles.preBox}>
//               Input: {data.example1?.input}
//               {"\n"}
//               Output: {data.example1?.output}
//             </pre>
//           </div>

//           {/* EXAMPLE 2 */}
//           <div style={styles.block}>
//             <h4>Example 2</h4>
//             <pre  style={styles.preBox}>
//               Input: {data.example2?.input}
//               {"\n"}
//               Output: {data.example2?.output}
//             </pre>
//           </div>

//           {/* CONSTRAINTS */}
//           <div style={styles.block}>
//             <h4>Constraints</h4>
//             <pre style={styles.preBox}>
//               {Array.isArray(data.constraints)
//                 ? data.constraints.join("\n")
//                 : data.constraints}
//             </pre>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// const styles = {
//   left: {
//     flex: 1,
//     padding: 30,
//     background: "#fff",
//     overflowY: "auto",
//     minWidth: 0,
//   },

//   // HEADER FIX (NO GAP BETWEEN TITLE & CONTROLS)
//   header: {
//     display: "flex",
//     alignItems: "center",
//     marginBottom:30,
//     justifyContent: "space-between",
//   },

//  titleHeader: {
//   margin: 0,
//   padding: 0,
//   fontSize: "20px",
//   fontWeight: "600",
//   lineHeight: 0, // 👈 removes extra vertical space
// },

//   controls: {
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//   },

//   timer: {
//     background: "#111",
//     color: "#fff",
//     padding: "6px 12px",
//     borderRadius: "6px",
//   },

//   // QUESTION TITLE SEPARATE SPACE
//   questionTitle: {
//     marginTop: 18,
//     marginBottom: 10,
//     fontSize: "18px",
//     fontWeight: "bold",
//   },
// preBox: {
//   whiteSpace: "pre-wrap",   // ⭐ main fix (wrap enable)
//   wordBreak: "break-word",  // ⭐ long text break
//   overflowWrap: "break-word",
//   fontSize: "14px",
//   lineHeight: "1.5",
//   margin: 0,
// },
//   block: {
//     marginTop: 15,
//     padding: 12,
//     background: "#f3f4f6",
//     borderRadius: 8,
//   },

//   iconBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     border: "none",
//     background: "#e5e7eb",
//     cursor: "pointer",
//   },
// };

// export default LeftAiInterview;

import { useEffect, useState } from "react";
import API from "../services/api";

function LeftAiInterview({ type, level, onTimeUp }) {
  const [data, setData] = useState(() => {
    const saved = sessionStorage.getItem(`${type}_${level}_question`);
    return saved ? JSON.parse(saved) : null;
  });
  const [speaking, setSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          alert("⏱ Time Over!");
          onTimeUp && onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const speakText = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    setSpeaking(true);
    speech.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(speech);
  };

  const speak = () => speakText(data?.statement);
  const stopSpeak = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  useEffect(() => {
    let active = true;

    const fetchQuestion = async () => {
      // If we already have data in state or sessionStorage, skip fetch
      if (data && data.statement) return;

      try {
        const res = await API.get("/ai/interview/question", {
          params: {
            type: type?.toUpperCase() || "DSA",
            level: level?.toLowerCase() || "easy",
          },
        });
        
        let fetchedData = res.data;
        if (!fetchedData || !fetchedData.statement) {
           throw new Error("Invalid data format");
        }

        if (!active) return;

        setData(fetchedData);
        sessionStorage.setItem(`${type}_${level}_question`, JSON.stringify(fetchedData));
      } catch (err) {
        if (!active) return;
        console.error("Error fetching question:", err.message);
        
        // Frontend Fallback Questions based on Type
        let fallback;
        if (type?.toUpperCase().includes("DB")) {
          fallback = {
            question: "Database User Management",
            statement: "Write a SQL query to find all users who have not made a purchase in the last 6 months. Assume tables 'Users' (id, name, created_at) and 'Purchases' (id, user_id, purchase_date).",
            example1: { input: "Users: (1,'Alice'), Purchases: []", output: "User Alice" },
            example2: { input: "Users: (2,'Bob'), Purchases: [(1,2,'2023-01-01')]", output: "User Bob" },
            constraints: ["Return names only", "Use subqueries or joins"],
            starterCode: "-- Write your SQL query here\nSELECT name FROM Users WHERE ...",
            expectedSolution: "-- Write your SQL query here\nSELECT name FROM Users WHERE id NOT IN (SELECT user_id FROM Purchases WHERE purchase_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH));"
          };
        } else if (type?.toUpperCase().includes("AI")) {
          fallback = {
            question: "Linear Regression Implementation",
            statement: "Implement a simple linear regression 'predict' function that takes a feature vector X and weights W (including bias). Return the dot product.",
            example1: { input: "X = [1, 2], W = [0.5, 0.2, 0.1]", output: "0.5 + 2*0.2 + 0.1 = 1.0" },
            example2: { input: "X = [0], W = [0, 0]", output: "0" },
            constraints: ["X and W must be compatible", "Handle bias at index 0"],
            starterCode: "def predict(X, W):\n    # write your solution here\n    pass",
            expectedSolution: "def predict(X, W):\n    # W[0] is bias, rest are features\n    bias = W[0]\n    features = W[1:]\n    return sum(x * w for x, w in zip(X, features)) + bias"
          };
        } else {
          const normLevel = level?.toLowerCase() || "easy";
          if (normLevel === "hard") {
            const hardFallbacks = [
              {
                question: "Trapping Rain Water",
                statement: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
                example1: { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
                example2: { input: "height = [4,2,0,3,2,5]", output: "9" },
                constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
                starterCode: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};"
              },
              {
                question: "Median of Two Sorted Arrays",
                statement: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
                example1: { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
                example2: { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" },
                constraints: ["nums1.length == m", "nums2.length == n", "0 <= m, n <= 1000", "1 <= m + n <= 2000"],
                starterCode: "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        \n    }\n};"
              },
              {
                question: "Merge k Sorted Lists",
                statement: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
                example1: { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
                example2: { input: "lists = []", output: "[]" },
                constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "lists[i] is sorted in ascending order."],
                starterCode: "class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        \n    }\n};"
              },
              {
                question: "Edit Distance",
                statement: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the operations: Insert, Delete, Replace.",
                example1: { input: "word1 = \"horse\", word2 = \"ros\"", output: "3" },
                example2: { input: "word1 = \"intention\", word2 = \"execution\"", output: "5" },
                constraints: ["0 <= word1.length, word2.length <= 500", "word1 and word2 consist of lowercase English letters."],
                starterCode: "class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        \n    }\n};"
              },
              {
                question: "Largest Rectangle in Histogram",
                statement: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, find the area of the largest rectangle in the histogram.",
                example1: { input: "heights = [2,1,5,6,2,3]", output: "10" },
                example2: { input: "heights = [2,4]", output: "4" },
                constraints: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
                starterCode: "class Solution {\npublic:\n    int largestRectangleArea(vector<int>& heights) {\n        \n    }\n};"
              },
              {
                question: "Binary Tree Maximum Path Sum",
                statement: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. Given the root of a binary tree, return the maximum path sum of any non-empty path.",
                example1: { input: "root = [1,2,3]", output: "6" },
                example2: { input: "root = [-10,9,20,null,null,15,7]", output: "42" },
                constraints: ["The number of nodes in the tree is in the range [1, 3 * 10^4]", "-1000 <= Node.val <= 1000"],
                starterCode: "class Solution {\npublic:\n    int maxPathSum(TreeNode* root) {\n        \n    }\n};"
              },
              {
                question: "Longest Consecutive Sequence",
                statement: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
                example1: { input: "nums = [100,4,200,1,3,2]", output: "4" },
                example2: { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
                constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
                starterCode: "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        \n    }\n};"
              },
              {
                question: "N-Queens",
                statement: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions.",
                example1: { input: "n = 4", output: "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]" },
                example2: { input: "n = 1", output: "[[\"Q\"]]" },
                constraints: ["1 <= n <= 9"],
                starterCode: "class Solution {\npublic:\n    vector<vector<string>> solveNQueens(int n) {\n        \n    }\n};"
              },
              {
                question: "Sudoku Solver",
                statement: "Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all valid Sudoku constraints.",
                example1: { input: "board = [[\"5\",\"3\",...]]", output: "Sudoku Solved" },
                example2: { input: "board = [[\".\",\".\",...]]", output: "Sudoku Solved" },
                constraints: ["board.length == 9", "board[i].length == 9", "board[i][j] is a digit or '.'"],
                starterCode: "class Solution {\npublic:\n    void solveSudoku(vector<vector<char>>& board) {\n        \n    }\n};"
              },
              {
                question: "Sliding Window Maximum",
                statement: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.",
                example1: { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" },
                example2: { input: "nums = [1], k = 1", output: "[1]" },
                constraints: ["1 <= nums.length <= 10^5", "1 <= k <= nums.length"],
                starterCode: "class Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        \n    }\n};"
              },
              {
                question: "Word Search II",
                statement: "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells.",
                example1: { input: "board = [['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']], words = ['oath','pea','eat','rain']", output: "['eat','oath']" },
                example2: { input: "board = [['a','b'],['c','d']], words = ['abcb']", output: "[]" },
                constraints: ["m == board.length", "n == board[i].length", "1 <= m, n <= 12", "1 <= words.length <= 3 * 10^4"],
                starterCode: "class Solution {\npublic:\n    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {\n        \n    }\n};"
              },
              {
                question: "Basic Calculator",
                statement: "Given a string s representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation. Note: You are not allowed to use any built-in function which evaluates strings as mathematical expressions.",
                example1: { input: "s = \"1 + 1\"", output: "2" },
                example2: { input: "s = \"(1+(4+5+2)-3)+(6+8)\"", output: "23" },
                constraints: ["1 <= s.length <= 3 * 10^5", "s consists of digits, '+', '-', '(', ')', and ' '."],
                starterCode: "class Solution {\npublic:\n    int calculate(string s) {\n        \n    }\n};"
              },
              {
                question: "Regular Expression Matching",
                statement: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' Matches any single character and '*' Matches zero or more of the preceding element.",
                example1: { input: "s = \"aa\", p = \"a\"", output: "false" },
                example2: { input: "s = \"ab\", p = \".*\"", output: "true" },
                constraints: ["1 <= s.length <= 20", "1 <= p.length <= 20", "s contains only lowercase English letters."],
                starterCode: "class Solution {\npublic:\n    bool isMatch(string s, string p) {\n        \n    }\n};"
              },
              {
                question: "Reverse Nodes in k-Group",
                statement: "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list.",
                example1: { input: "head = [1,2,3,4,5], k = 2", output: "[2,1,4,3,5]" },
                example2: { input: "head = [1,2,3,4,5], k = 3", output: "[3,2,1,4,5]" },
                constraints: ["The number of nodes in the list is n.", "1 <= k <= n <= 5000", "0 <= Node.val <= 1000"],
                starterCode: "class Solution {\npublic:\n    ListNode* reverseKGroup(ListNode* head, int k) {\n        \n    }\n};"
              },
              {
                question: "First Missing Positive",
                statement: "Given an unsorted integer array nums, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses constant extra space.",
                example1: { input: "nums = [1,2,0]", output: "3" },
                example2: { input: "nums = [3,4,-1,1]", output: "2" },
                constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
                starterCode: "class Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        \n    }\n};"
              },
              {
                question: "Wildcard Matching",
                statement: "Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where '?' Matches any single character and '*' Matches any sequence of characters (including the empty sequence).",
                example1: { input: "s = \"aa\", p = \"a\"", output: "false" },
                example2: { input: "s = \"aa\", p = \"*\"", output: "true" },
                constraints: ["0 <= s.length, p.length <= 2000", "s contains only lowercase English letters."],
                starterCode: "class Solution {\npublic:\n    bool isMatch(string s, string p) {\n        \n    }\n};"
              },
              {
                question: "Maximum Profit in Job Scheduling",
                statement: "We have n jobs, where every job is scheduled to be done from startTime[i] to endTime[i], obtaining a profit of profit[i]. Return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range.",
                example1: { input: "startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]", output: "120" },
                example2: { input: "startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]", output: "150" },
                constraints: ["1 <= startTime.length == endTime.length == profit.length <= 5 * 10^4", "1 <= startTime[i] < endTime[i] <= 10^9"],
                starterCode: "class Solution {\npublic:\n    int jobScheduling(vector<int>& startTime, vector<int>& endTime, vector<int>& profit) {\n        \n    }\n};"
              },
              {
                question: "Minimum Window Substring",
                statement: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".",
                example1: { input: "s = \"ADOBECODEBANC\", t = \"ABC\"", output: "\"BANC\"" },
                example2: { input: "s = \"a\", t = \"a\"", output: "\"a\"" },
                constraints: ["m == s.length", "n == t.length", "1 <= m, n <= 10^5", "s and t consist of uppercase and lowercase English letters."],
                starterCode: "class Solution {\npublic:\n    string minWindow(string s, string t) {\n        \n    }\n};"
              },
              {
                question: "Serialize and Deserialize Binary Tree",
                statement: "Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work.",
                example1: { input: "root = [1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]" },
                example2: { input: "root = []", output: "[]" },
                constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-1000 <= Node.val <= 1000"],
                starterCode: "class Codec {\npublic:\n    string serialize(TreeNode* root) {\n        \n    }\n    TreeNode* deserialize(string data) {\n        \n    }\n};"
              },
              {
                question: "Word Ladder",
                statement: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter. Return the number of words in the shortest transformation sequence.",
                example1: { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", output: "5" },
                example2: { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", output: "0" },
                constraints: ["1 <= beginWord.length <= 10", "endWord.length == beginWord.length", "1 <= wordList.length <= 5000"],
                starterCode: "class Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        \n    }\n};"
              }
            ];
            const randomIndex = Math.floor(Math.random() * hardFallbacks.length);
            fallback = hardFallbacks[randomIndex];
          } else if (normLevel === "medium") {
            const mediumFallbacks = [
              {
                question: "Container With Most Water",
                statement: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
                example1: { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
                example2: { input: "height = [1,1]", output: "1" },
                constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
                starterCode: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};"
              },
              {
                question: "3Sum",
                statement: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
                example1: { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
                example2: { input: "nums = [0,1,1]", output: "[]" },
                constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
                starterCode: "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};"
              },
              {
                question: "Longest Substring Without Repeating Characters",
                statement: "Given a string s, find the length of the longest substring without repeating characters.",
                example1: { input: "s = \"abcabcbb\"", output: "3" },
                example2: { input: "s = \"bbbbb\"", output: "1" },
                constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
                starterCode: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};"
              },
              {
                question: "Group Anagrams",
                statement: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
                example1: { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" },
                example2: { input: "strs = [\"\"]", output: "[[\"\"]]" },
                constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
                starterCode: "class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        \n    }\n};"
              },
              {
                question: "Product of Array Except Self",
                statement: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Algorithm must run in O(n) and without division.",
                example1: { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
                example2: { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
                constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
                starterCode: "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};"
              },
              {
                question: "Maximum Subarray",
                statement: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
                example1: { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
                example2: { input: "nums = [5,4,-1,7,8]", output: "23" },
                constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
                starterCode: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};"
              },
              {
                question: "Search in Rotated Sorted Array",
                statement: "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. Algorithm must be O(log n).",
                example1: { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
                example2: { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
                constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i], target <= 10^4", "All values of nums are unique."],
                starterCode: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};"
              },
              {
                question: "Kth Largest Element in an Array",
                statement: "Given an integer array nums and an integer k, return the kth largest element in the array. Solve it without sorting in O(n) average time.",
                example1: { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
                example2: { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" },
                constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
                starterCode: "class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        \n    }\n};"
              },
              {
                question: "Top K Frequent Elements",
                statement: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
                example1: { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
                example2: { input: "nums = [1], k = 1", output: "[1]" },
                constraints: ["1 <= nums.length <= 10^5", "k is in the range [1, the number of unique elements in the array]", "nums[i] is an integer."],
                starterCode: "class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        \n    }\n};"
              },
              {
                question: "Number of Islands",
                statement: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
                example1: { input: "grid = [[\"1\",\"1\",\"1\"],[\"1\",\"1\",\"0\"],[\"1\",\"0\",\"0\"]]", output: "1" },
                example2: { input: "grid = [[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]", output: "2" },
                constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
                starterCode: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};"
              },
              {
                question: "Insert Interval",
                statement: "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval. Insert newInterval into intervals.",
                example1: { input: "intervals = [[1,3],[6,9]], newInterval = [2,5]", output: "[[1,5],[6,9]]" },
                example2: { input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", output: "[[1,2],[3,10],[12,16]]" },
                constraints: ["0 <= intervals.length <= 10^4", "intervals is sorted by starti in ascending order."],
                starterCode: "class Solution {\npublic:\n    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {\n        \n    }\n};"
              },
              {
                question: "Merge Intervals",
                statement: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
                example1: { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
                example2: { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
                constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2"],
                starterCode: "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};"
              },
              {
                question: "Clone Graph",
                statement: "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.",
                example1: { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" },
                example2: { input: "adjList = [[]]", output: "[[]]" },
                constraints: ["The number of nodes in the graph is in the range [0, 100].", "1 <= Node.val <= 100", "Node.val is unique for each node."],
                starterCode: "class Solution {\npublic:\n    Node* cloneGraph(Node* node) {\n        \n    }\n};"
              },
              {
                question: "Course Schedule",
                statement: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
                example1: { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
                example2: { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" },
                constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
                starterCode: "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        \n    }\n};",
                expectedSolution: "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        vector<vector<int>> adj(numCourses);\n        vector<int> indegree(numCourses, 0);\n        for (auto& pre : prerequisites) {\n            adj[pre[1]].push_back(pre[0]);\n            indegree[pre[0]]++;\n        }\n        queue<int> q;\n        for (int i = 0; i < numCourses; i++) {\n            if (indegree[i] == 0) q.push(i);\n        }\n        int count = 0;\n        while (!q.empty()) {\n            int curr = q.front();\n            q.pop();\n            count++;\n            for (int neighbor : adj[curr]) {\n                indegree[neighbor]--;\n                if (indegree[neighbor] == 0) q.push(neighbor);\n            }\n        }\n        return count == numCourses;\n    }\n};"
              },
              {
                question: "Implement Trie (Prefix Tree)",
                statement: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class: Trie(), insert(word), search(word), startsWith(prefix).",
                example1: { input: "[\"Trie\", \"insert\", \"search\", \"startsWith\"]\n[[], [\"apple\"], [\"apple\"], [\"app\"]]", output: "[null, null, true, true]" },
                example2: { input: "[\"Trie\", \"search\"]\n[[], [\"a\"]]", output: "[null, false]" },
                constraints: ["1 <= word.length, prefix.length <= 2000", "word and prefix consist only of lowercase English letters."],
                starterCode: "class Trie {\npublic:\n    Trie() {}\n    void insert(string word) {}\n    bool search(string word) {}\n    bool startsWith(string prefix) {}\n};"
              },
              {
                question: "Coin Change",
                statement: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
                example1: { input: "coins = [1,2,5], amount = 11", output: "3" },
                example2: { input: "coins = [2], amount = 3", output: "-1" },
                constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
                starterCode: "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};"
              },
              {
                question: "Word Break",
                statement: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
                example1: { input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", output: "true" },
                example2: { input: "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", output: "false" },
                constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 20"],
                starterCode: "class Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        \n    }\n};"
              },
              {
                question: "Validate Binary Search Tree",
                statement: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
                example1: { input: "root = [2,1,3]", output: "true" },
                example2: { input: "root = [5,1,4,null,null,3,6]", output: "false" },
                constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "-2^31 <= Node.val <= 2^31 - 1"],
                starterCode: "class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        \n    }\n};"
              },
              {
                question: "Non-overlapping Intervals",
                statement: "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
                example1: { input: "intervals = [[1,2],[2,3],[3,4],[1,3]]", output: "1" },
                example2: { input: "intervals = [[1,2],[1,2],[1,2]]", output: "2" },
                constraints: ["1 <= intervals.length <= 10^5", "intervals[i].length == 2", "-5 * 10^4 <= starti < endi <= 5 * 10^4"],
                starterCode: "class Solution {\npublic:\n    int eraseOverlapIntervals(vector<vector<int>>& intervals) {\n        \n    }\n};"
              },
              {
                question: "Combination Sum",
                statement: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.",
                example1: { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
                example2: { input: "candidates = [2], target = 1", output: "[]" },
                constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "All elements of candidates are distinct."],
                starterCode: "class Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        \n    }\n};"
              }
            ];
            const randomIndex = Math.floor(Math.random() * mediumFallbacks.length);
            fallback = mediumFallbacks[randomIndex];
          } else {
            const easyFallbacks = [
              {
                question: "Two Sum",
                statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                example1: { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
                example2: { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
                constraints: ["2 <= nums.length <= 10^4", "Exactly one solution"],
                starterCode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"
              },
              {
                question: "Contains Duplicate",
                statement: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
                example1: { input: "nums = [1,2,3,1]", output: "true" },
                example2: { input: "nums = [1,2,3,4]", output: "false" },
                constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
                starterCode: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};"
              },
              {
                question: "Valid Parentheses",
                statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
                example1: { input: "s = \"()\"", output: "true" },
                example2: { input: "s = \"()[]{}\"", output: "true" },
                constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only"],
                starterCode: "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};"
              },
              {
                question: "Best Time to Buy and Sell Stock",
                statement: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
                example1: { input: "prices = [7,1,5,3,6,4]", output: "5" },
                example2: { input: "prices = [7,6,4,3,1]", output: "0" },
                constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
                starterCode: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};"
              },
              {
                question: "Valid Palindrome",
                statement: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
                example1: { input: "s = \"A man, a plan, a canal: Panama\"", output: "true" },
                example2: { input: "s = \"race a car\"", output: "false" },
                constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters"],
                starterCode: "class Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};"
              },
              {
                question: "Binary Search",
                statement: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
                example1: { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
                example2: { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
                constraints: ["1 <= nums.length <= 10^4", "All the integers in nums are unique", "nums is sorted in ascending order"],
                starterCode: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};"
              },
              {
                question: "Reverse Linked List",
                statement: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
                example1: { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
                example2: { input: "head = [1,2]", output: "[2,1]" },
                constraints: ["The number of nodes in the list is the range [0, 5000]", "-5000 <= Node.val <= 5000"],
                starterCode: "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};"
              },
              {
                question: "Single Number",
                statement: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
                example1: { input: "nums = [2,2,1]", output: "1" },
                example2: { input: "nums = [4,1,2,1,2]", output: "4" },
                constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Each element in the array appears twice except for one."],
                starterCode: "class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        \n    }\n};"
              },
              {
                question: "Palindrome Number",
                statement: "Given an integer x, return true if x is a palindrome, and false otherwise.",
                example1: { input: "x = 121", output: "true" },
                example2: { input: "x = -121", output: "false" },
                constraints: ["-2^31 <= x <= 2^31 - 1"],
                starterCode: "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};"
              },
              {
                question: "Missing Number",
                statement: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
                example1: { input: "nums = [3,0,1]", output: "2" },
                example2: { input: "nums = [0,1]", output: "2" },
                constraints: ["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n"],
                starterCode: "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};"
              },
              {
                question: "Valid Anagram",
                statement: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
                example1: { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
                example2: { input: "s = \"rat\", t = \"car\"", output: "false" },
                constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
                starterCode: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};"
              },
              {
                question: "Linked List Cycle",
                statement: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
                example1: { input: "head = [3,2,0,-4], pos = 1", output: "true" },
                example2: { input: "head = [1], pos = -1", output: "false" },
                constraints: ["The number of the nodes in the list is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5"],
                starterCode: "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        \n    }\n};"
              },
              {
                question: "Invert Binary Tree",
                statement: "Given the root of a binary tree, invert the tree, and return its root.",
                example1: { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
                example2: { input: "root = [2,1,3]", output: "[2,3,1]" },
                constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
                starterCode: "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        \n    }\n};"
              },
              {
                question: "Maximum Depth of Binary Tree",
                statement: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
                example1: { input: "root = [3,9,20,null,null,15,7]", output: "3" },
                example2: { input: "root = [1,null,2]", output: "2" },
                constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"],
                starterCode: "class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        \n    }\n};"
              },
              {
                question: "Diameter of Binary Tree",
                statement: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree.",
                example1: { input: "root = [1,2,3,4,5]", output: "3" },
                example2: { input: "root = [1,2]", output: "1" },
                constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "-100 <= Node.val <= 100"],
                starterCode: "class Solution {\npublic:\n    int diameterOfBinaryTree(TreeNode* root) {\n        \n    }\n};"
              },
              {
                question: "Move Zeroes",
                statement: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.",
                example1: { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
                example2: { input: "nums = [0]", output: "[0]" },
                constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
                starterCode: "class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        \n    }\n};"
              },
              {
                question: "Symmetric Tree",
                statement: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
                example1: { input: "root = [1,2,2,3,4,4,3]", output: "true" },
                example2: { input: "root = [1,2,2,null,3,null,3]", output: "false" },
                constraints: ["The number of nodes in the tree is in the range [1, 1000].", "-100 <= Node.val <= 100"],
                starterCode: "class Solution {\npublic:\n    bool isSymmetric(TreeNode* root) {\n        \n    }\n};"
              },
              {
                question: "First Bad Version",
                statement: "You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad. Suppose you have n versions [1, 2, ..., n] and you want to find out the first bad one.",
                example1: { input: "n = 5, bad = 4", output: "4" },
                example2: { input: "n = 1, bad = 1", output: "1" },
                constraints: ["1 <= bad <= n <= 2^31 - 1"],
                starterCode: "class Solution {\npublic:\n    int firstBadVersion(int n) {\n        \n    }\n};"
              },
              {
                question: "Climbing Stairs",
                statement: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
                example1: { input: "n = 2", output: "2" },
                example2: { input: "n = 3", output: "3" },
                constraints: ["1 <= n <= 45"],
                starterCode: "class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};"
              },
              {
                question: "Reverse String",
                statement: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
                example1: { input: "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
                example2: { input: "s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", output: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" },
                constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
                starterCode: "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};"
              }
            ];
            const randomIndex = Math.floor(Math.random() * easyFallbacks.length);
            fallback = easyFallbacks[randomIndex];
          }
        }

        if (!active) return;
        setData(fallback);
        sessionStorage.setItem(`${type}_${level}_question`, JSON.stringify(fallback));
      }
    };
    fetchQuestion();
    return () => {
      active = false;
    };
  }, [type, level]);

  useEffect(() => {
    if (data?.statement) {
      const timer = setTimeout(() => speakText(data.statement), 500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  return (
    <div style={styles.left}>

      {/* HEADER */}
      <div style={styles.header}>

        {/* AI AVATAR + NAME */}
        <div style={styles.avatarSection}>
          <div style={{
            ...styles.avatarCircle,
            border: speaking ? "2px solid #00d4ff" : "2px solid #2a2a4a",
            boxShadow: speaking ? "0 0 16px #00d4ff88" : "0 0 6px #00000088",
          }}>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
              <rect x="20" y="15" width="60" height="60" rx="12" fill="#0f3460" stroke="#00d4ff" strokeWidth="2" />
              <circle cx="37" cy="40" r="8" fill="#00d4ff" opacity="0.9" />
              <circle cx="63" cy="40" r="8" fill="#00d4ff" opacity="0.9" />
              <circle cx="37" cy="40" r="4" fill="#001a33" />
              <circle cx="63" cy="40" r="4" fill="#001a33" />
              <circle cx="37" cy="40" r="2" fill="white" opacity="0.8" />
              <circle cx="63" cy="40" r="2" fill="white" opacity="0.8" />
              {speaking ? (
                <rect x="33" y="58" width="34" height="8" rx="4" fill="#00d4ff" opacity="0.9" />
              ) : (
                <rect x="33" y="58" width="34" height="6" rx="3" fill="#00d4ff" opacity="0.5" />
              )}
              <line x1="50" y1="15" x2="50" y2="5" stroke="#00d4ff" strokeWidth="2" />
              <circle cx="50" cy="4" r="3" fill="#00d4ff" />
            </svg>
          </div>

          <div>
            <div style={styles.appName}>Interview Buddy</div>
            <div style={styles.statusBadge}>
              <span style={{
                color: speaking ? "#00d4ff" : "#888",
                fontSize: "11px",
              }}>
                {speaking ? "● Speaking..." : "○ Waiting..."}
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div style={styles.controls}>
          <button onClick={speak} style={styles.iconBtn} title="Speak">
            🔊
          </button>
          <button onClick={stopSpeak} style={styles.iconBtn} title="Stop">
            ⏹
          </button>
        </div>

        {/* TIMER */}
        <span style={{
          ...styles.timer,
          color: timeLeft < 300 ? "#ff4d4d" : "#00d4ff",
          borderColor: timeLeft < 300 ? "#ff4d4d44" : "#00d4ff44",
        }}>
          {formatTime()}
        </span>
      </div>

      {/* DIVIDER */}
      <div style={styles.divider} />

      {/* CONTENT */}
      {!data ? (
        <div style={styles.loading}>
          <div style={styles.loadingDot} />
          Loading question...
        </div>
      ) : (
        <>
          <div style={styles.questionTitle}>{data.question}</div>

          <div style={styles.block}>
            <h4 style={styles.blockTitle}>📋 Problem</h4>
            <p style={styles.blockText}>{data.statement}</p>
          </div>

          <div style={styles.block}>
            <h4 style={styles.blockTitle}>💡 Example 1</h4>
            <pre style={styles.preBox}>
              Input: {data.example1?.input}{"\n"}
              Output: {data.example1?.output}
            </pre>
          </div>

          <div style={styles.block}>
            <h4 style={styles.blockTitle}>💡 Example 2</h4>
            <pre style={styles.preBox}>
              Input: {data.example2?.input}{"\n"}
              Output: {data.example2?.output}
            </pre>
          </div>

          <div style={styles.block}>
            <h4 style={styles.blockTitle}>⚠️ Constraints</h4>
            <pre style={styles.preBox}>
              {Array.isArray(data.constraints)
                ? data.constraints.join("\n")
                : data.constraints}
            </pre>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  left: {
    flex: 1,
    padding: "24px",
    background: "#0d0d1a",
    overflowY: "auto",
    minWidth: 0,
    color: "#e0e0e0",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
    gap: "12px",
  },

  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatarCircle: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    flexShrink: 0,
  },

  appName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#00d4ff",
    letterSpacing: "0.5px",
  },

  statusBadge: {
    marginTop: "2px",
  },

  controls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  iconBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid #2a2a4a",
    background: "#1a1a2e",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },

  timer: {
    background: "#1a1a2e",
    border: "1px solid #00d4ff44",
    padding: "6px 14px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
    letterSpacing: "1px",
    transition: "all 0.3s",
  },

  divider: {
    height: "1px",
    background: "linear-gradient(to right, #00d4ff33, transparent)",
    marginBottom: "20px",
  },

  loading: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#888",
    fontSize: "14px",
    marginTop: "40px",
    justifyContent: "center",
    animation: "blink 1.4s ease-in-out infinite",
  },

  loadingDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#00d4ff",
    animation: "blink 1s ease-in-out infinite",
  },

  questionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "16px",
    lineHeight: "1.4",
  },

  block: {
    marginTop: "12px",
    padding: "14px",
    background: "#1a1a2e",
    borderRadius: "10px",
    border: "1px solid #2a2a4a",
  },

  blockTitle: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    fontWeight: "600",
    color: "#00d4ff",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  blockText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#c0c0d0",
  },

  preBox: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: 0,
    color: "#a0a0b0",
    fontFamily: "monospace",
  },
};

export default LeftAiInterview;