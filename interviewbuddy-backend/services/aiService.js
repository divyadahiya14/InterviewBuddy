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

const fallbackAIMLEasyQuestions = [
  {
    question: "Mean and Median of Features",
    statement: "Write a Python function that takes a list of numerical features and returns their mean and median as a tuple: (mean, median).",
    example1: { input: "features = [1, 3, 3, 6, 7, 8, 9]", output: "(5.29, 6.0)" },
    example2: { input: "features = [1, 2, 3, 4]", output: "(2.5, 2.5)" },
    constraints: ["len(features) >= 1", "All features are real numbers"],
    starterCode: "def mean_median(features):\n    pass",
    expectedSolution: "def mean_median(features):\n    n = len(features)\n    mean = sum(features) / n\n    sorted_f = sorted(features)\n    if n % 2 != 0:\n        median = float(sorted_f[n // 2])\n    else:\n        median = (sorted_f[(n // 2) - 1] + sorted_f[n // 2]) / 2.0\n    return (round(mean, 2), round(median, 2))"
  },
  {
    question: "Min-Max Feature Scaling",
    statement: "Implement a function that performs Min-Max normalization on a 1D list of numerical features. The output should be values between 0.0 and 1.0.",
    example1: { input: "features = [10, 20, 30, 40, 50]", output: "[0.0, 0.25, 0.5, 0.75, 1.0]" },
    example2: { input: "features = [1, 2, 3]", output: "[0.0, 0.5, 1.0]" },
    constraints: ["1 <= len(features) <= 1000", "Min and Max of list must not be equal"],
    starterCode: "def normalize_data(features):\n    pass",
    expectedSolution: "def normalize_data(features):\n    mn = min(features)\n    mx = max(features)\n    return [float(x - mn) / (mx - mn) for x in features]"
  },
  {
    question: "Accuracy Score Calculation",
    statement: "Implement a function to calculate the accuracy of a classification model. Given y_true (true targets) and y_pred (predicted targets) lists of identical length, return the accuracy as a float between 0.0 and 1.0.",
    example1: { input: "y_true = [1, 0, 1, 1], y_pred = [1, 0, 0, 1]", output: "0.75" },
    example2: { input: "y_true = [0, 0], y_pred = [1, 1]", output: "0.0" },
    constraints: ["len(y_true) == len(y_pred)", "len(y_true) >= 1"],
    starterCode: "def accuracy_score(y_true, y_pred):\n    pass",
    expectedSolution: "def accuracy_score(y_true, y_pred):\n    correct = sum(1 for yt, yp in zip(y_true, y_pred) if yt == yp)\n    return float(correct) / len(y_true)"
  },
  {
    question: "Mean Squared Error (MSE)",
    statement: "Write a function to compute the Mean Squared Error (MSE) between actual targets and predicted outputs.",
    example1: { input: "actual = [3, -0.5, 2, 7], predicted = [2.5, 0.0, 2, 8]", output: "0.375" },
    example2: { input: "actual = [1, 2], predicted = [1, 2]", output: "0.0" },
    constraints: ["len(actual) == len(predicted)", "len(actual) >= 1"],
    starterCode: "def mean_squared_error(actual, predicted):\n    pass",
    expectedSolution: "def mean_squared_error(actual, predicted):\n    squared_errors = [(act - pred) ** 2 for act, pred in zip(actual, predicted)]\n    return sum(squared_errors) / len(actual)"
  },
  {
    question: "LeakyReLU Activation",
    statement: "Write a Python function to apply the LeakyReLU activation function element-wise on a list of floating-point values. The formula is max(alpha * x, x), where alpha defaults to 0.01.",
    example1: { input: "x = [-2, 0, 3], alpha = 0.1", output: "[-0.2, 0.0, 3.0]" },
    example2: { input: "x = [-5, 10], alpha = 0.01", output: "[-0.05, 10.0]" },
    constraints: ["len(x) >= 1", "alpha is a positive floating point constant"],
    starterCode: "def leaky_relu(x, alpha=0.01):\n    pass",
    expectedSolution: "def leaky_relu(x, alpha=0.01):\n    return [float(alpha * val) if val < 0 else float(val) for val in x]"
  }
];

const fallbackAIMLMediumQuestions = [
  {
    question: "k-NN Euclidean Distance",
    statement: "Given a query point (tuple of coordinates) and a list of database points (tuples of coordinates), compute the Euclidean distance from the query point to each point and return the index of the closest point (0-indexed).",
    example1: { input: "query = (0, 0), points = [(3, 4), (1, 1), (5, 12)]", output: "1" },
    example2: { input: "query = (1, 2), points = [(2, 3), (1, 10)]", output: "0" },
    constraints: ["len(points) >= 1", "All points have same dimension"],
    starterCode: "def closest_point(query, points):\n    pass",
    expectedSolution: "import math\ndef closest_point(query, points):\n    min_dist = float('inf')\n    closest_idx = -1\n    for idx, pt in enumerate(points):\n        dist = math.sqrt(sum((q - p) ** 2 for q, p in zip(query, pt)))\n        if dist < min_dist:\n            min_dist = dist\n            closest_idx = idx\n    return closest_idx"
  },
  {
    question: "Sigmoid and its Derivative",
    statement: "Implement a function that calculates the sigmoid activation function and its derivative. Given input x, return a tuple: (sigmoid(x), sigmoid_derivative(x)).",
    example1: { input: "x = 0", output: "(0.5, 0.25)" },
    example2: { input: "x = 2", output: "(0.88, 0.11)" },
    constraints: ["x is a real number"],
    starterCode: "def sigmoid_and_derivative(x):\n    pass",
    expectedSolution: "import math\ndef sigmoid_and_derivative(x):\n    s = 1.0 / (1.0 + math.exp(-x))\n    ds = s * (1.0 - s)\n    return (round(s, 2), round(ds, 2))"
  },
  {
    question: "One-Hot Encoding",
    statement: "Given a list of labels (strings or integers) and a list of unique vocabulary classes in a specified order, write a function that outputs a 2D one-hot encoded representation (list of lists of 0s and 1s).",
    example1: { input: "labels = ['cat', 'dog', 'cat'], classes = ['cat', 'dog', 'bird']", output: "[[1, 0, 0], [0, 1, 0], [1, 0, 0]]" },
    example2: { input: "labels = [0, 2], classes = [0, 1, 2]", output: "[[1, 0, 0], [0, 0, 1]]" },
    constraints: ["All labels exist in classes list", "classes contains distinct entries"],
    starterCode: "def one_hot_encode(labels, classes):\n    pass",
    expectedSolution: "def one_hot_encode(labels, classes):\n    class_map = {cls: idx for idx, cls in enumerate(classes)}\n    result = []\n    for label in labels:\n        encoded = [0] * len(classes)\n        if label in class_map:\n            encoded[class_map[label]] = 1\n        result.append(encoded)\n    return result"
  },
  {
    question: "Z-Score Standardization",
    statement: "Standardize a feature list by subtracting the mean and dividing by the standard deviation. Return the standardized list of floats. If standard deviation is 0, return the original list.",
    example1: { input: "features = [2, 4, 4, 4, 5, 5, 7, 9]", output: "[-1.5, -0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 2.0]" },
    example2: { input: "features = [1, 1]", output: "[1.0, 1.0]" },
    constraints: ["len(features) >= 1"],
    starterCode: "def standardize(features):\n    pass",
    expectedSolution: "import math\ndef standardize(features):\n    n = len(features)\n    if n <= 1: return [float(x) for x in features]\n    mean = sum(features) / n\n    variance = sum((x - mean) ** 2 for x in features) / n\n    std_dev = math.sqrt(variance)\n    if std_dev == 0: return [float(x) for x in features]\n    return [round((x - mean) / std_dev, 2) for x in features]"
  },
  {
    question: "F1-Score Calculation",
    statement: "Compute the F1-score given True Positives (TP), False Positives (FP), and False Negatives (FN). Return the F1 score rounded to 2 decimal places. If TP + FP == 0 or TP + FN == 0, return 0.0.",
    example1: { input: "tp = 10, fp = 3, fn = 2", output: "0.8" },
    example2: { input: "tp = 0, fp = 0, fn = 5", output: "0.0" },
    constraints: ["tp >= 0", "fp >= 0", "fn >= 0"],
    starterCode: "def f1_score(tp, fp, fn):\n    pass",
    expectedSolution: "def f1_score(tp, fp, fn):\n    if tp == 0: return 0.0\n    precision = tp / (tp + fp)\n    recall = tp / (tp + fn)\n    if precision + recall == 0: return 0.0\n    f1 = 2 * (precision * recall) / (precision + recall)\n    return round(f1, 2)"
  }
];

const fallbackAIMLHardQuestions = [
  {
    question: "Linear Regression Gradient Descent Update",
    statement: "Compute the updated weights (w) and bias (b) for a simple 1D linear regression model after one step of gradient descent. Given features x, actual targets y, current weight w, current bias b, and learning rate lr, return (updated_w, updated_b).",
    example1: { input: "x = [1, 2], y = [3, 5], w = 1.0, b = 0.5, lr = 0.1", output: "(1.55, 0.75)" },
    example2: { input: "x = [0], y = [1], w = 0.0, b = 0.0, lr = 0.1", output: "(0.0, 0.1)" },
    constraints: ["len(x) == len(y)", "len(x) >= 1", "lr > 0"],
    starterCode: "def gradient_descent_step(x, y, w, b, lr):\n    pass",
    expectedSolution: "def gradient_descent_step(x, y, w, b, lr):\n    n = len(x)\n    grad_w = 0.0\n    grad_b = 0.0\n    for xi, yi in zip(x, y):\n        pred = w * xi + b\n        err = pred - yi\n        grad_w += err * xi\n        grad_b += err\n    grad_w = (2 / n) * grad_w\n    grad_b = (2 / n) * grad_b\n    new_w = w - lr * grad_w\n    new_b = b - lr * grad_b\n    return (round(new_w, 2), round(new_b, 2))"
  },
  {
    question: "Stable Softmax Function",
    statement: "Implement the softmax function on a 1D list of floating point values. It must be numerically stable (i.e. subtract the maximum value in the list before exponentiation to prevent overflow). Return list of probabilities.",
    example1: { input: "logits = [1, 2, 3]", output: "[0.09, 0.24, 0.67]" },
    example2: { input: "logits = [1000, 1001, 999]", output: "[0.24, 0.67, 0.09]" },
    constraints: ["len(logits) >= 1"],
    starterCode: "def stable_softmax(logits):\n    pass",
    expectedSolution: "import math\ndef stable_softmax(logits):\n    mx = max(logits)\n    exp_vals = [math.exp(x - mx) for x in logits]\n    sum_exp = sum(exp_vals)\n    return [round(ev / sum_exp, 2) for ev in exp_vals]"
  },
  {
    question: "K-Means Centroid Update",
    statement: "Given a list of data points (2D coordinates) and their corresponding cluster labels (list of integers matching data points index), calculate and return the updated centroids list of tuples sorted by cluster index.",
    example1: { input: "points = [(1, 2), (2, 3), (10, 12)], labels = [0, 0, 1]", output: "[(1.5, 2.5), (10.0, 12.0)]" },
    example2: { input: "points = [(0, 0), (1, 1)], labels = [1, 0]", output: "[(1.0, 1.0), (0.0, 0.0)]" },
    constraints: ["len(points) == len(labels)", "len(points) >= 1", "All labels >= 0"],
    starterCode: "def update_centroids(points, labels):\n    pass",
    expectedSolution: "def update_centroids(points, labels):\n    clusters = {}\n    for pt, lbl in zip(points, labels):\n        if lbl not in clusters:\n            clusters[lbl] = []\n        clusters[lbl].append(pt)\n    centroids = []\n    for lbl in sorted(clusters.keys()):\n        pts = clusters[lbl]\n        avg_x = sum(p[0] for p in pts) / len(pts)\n        avg_y = sum(p[1] for p in pts) / len(pts)\n        centroids.append((round(avg_x, 2), round(avg_y, 2)))\n    return centroids"
  },
  {
    question: "Binary Cross-Entropy Loss",
    statement: "Compute the Binary Cross-Entropy Loss given true target list (y_true) containing 0s and 1s, and predicted probability list (y_pred). Clip predicted values to [1e-15, 1 - 1e-15] to prevent log(0) domain errors.",
    example1: { input: "y_true = [1, 0, 1], y_pred = [0.9, 0.1, 0.8]", output: "0.14" },
    example2: { input: "y_true = [1, 0], y_pred = [0, 1]", output: "34.54" },
    constraints: ["len(y_true) == len(y_pred)", "len(y_true) >= 1"],
    starterCode: "def bce_loss(y_true, y_pred):\n    pass",
    expectedSolution: "import math\ndef bce_loss(y_true, y_pred):\n    loss = 0.0\n    n = len(y_true)\n    for yt, yp in zip(y_true, y_pred):\n        yp = max(1e-15, min(1.0 - 1e-15, yp))\n        loss += -1 * (yt * math.log(yp) + (1 - yt) * math.log(1 - yp))\n    return round(loss / n, 2)"
  },
  {
    question: "L2 Regularization Gradient",
    statement: "Compute the gradient of L2 regularization (Ridge regression penalty) with respect to a weight list. Given weights list (w) and lambda penalty factor, return the regularization gradient array [lambda * wi for each weight].",
    example1: { input: "w = [0.5, -1.0, 2.0], lmbda = 0.1", output: "[0.05, -0.1, 0.2]" },
    example2: { input: "w = [10.0], lmbda = 0.5", output: "[5.0]" },
    constraints: ["len(w) >= 1", "lmbda >= 0"],
    starterCode: "def l2_gradient(w, lmbda):\n    pass",
    expectedSolution: "def l2_gradient(w, lmbda):\n    return [round(lmbda * val, 2) for val in w]"
  }
];

const fallbackDBEasyQuestions = [
  {
    question: "Select Active Users",
    statement: "Write a SQL query to select all columns for users from the 'Users' table who have an active status. Order by 'name' alphabetically.",
    example1: { input: "Users = [(1,'Alice','active'),(2,'Bob','inactive')]", output: "[(1,'Alice','active')]" },
    example2: { input: "Users = []", output: "No records" },
    constraints: ["Return all columns (*)", "Filter where status = 'active'"],
    starterCode: "SELECT * FROM Users ...",
    expectedSolution: "SELECT * FROM Users WHERE status = 'active' ORDER BY name ASC;"
  },
  {
    question: "Count Orders by Customer",
    statement: "Write a SQL query to count the total number of orders placed by each customer. Return customer_id and the order count as 'total_orders'. Group by customer_id.",
    example1: { input: "Orders = [(1, 101), (2, 101), (3, 102)]", output: "[(101, 2), (102, 1)]" },
    example2: { input: "Orders = []", output: "No records" },
    constraints: ["Group results by customer_id"],
    starterCode: "SELECT customer_id, COUNT(*) ...",
    expectedSolution: "SELECT customer_id, COUNT(id) AS total_orders FROM Orders GROUP BY customer_id;"
  },
  {
    question: "Find Employees with High Salaries",
    statement: "Write a SQL query to find the names of all employees from the 'Employees' table who earn more than $80,000 per year.",
    example1: { input: "Employees = [(1,'John',90000),(2,'Jane',75000)]", output: "['John']" },
    example2: { input: "Employees = []", output: "No records" },
    constraints: ["Return only the employee name column"],
    starterCode: "SELECT name FROM Employees ...",
    expectedSolution: "SELECT name FROM Employees WHERE salary > 80000;"
  },
  {
    question: "List Products by Price",
    statement: "Write a SQL query to retrieve product names and prices from the 'Products' table where price is at least $50. Sort by price descending.",
    example1: { input: "Products = [(1,'Shoes',60),(2,'Hat',20)]", output: "[('Shoes',60)]" },
    example2: { input: "Products = []", output: "No records" },
    constraints: ["Filter where price >= 50", "Sort descending"],
    starterCode: "SELECT name, price FROM Products ...",
    expectedSolution: "SELECT name, price FROM Products WHERE price >= 50 ORDER BY price DESC;"
  },
  {
    question: "Find Customer Emails",
    statement: "Write a SQL query to select all unique email addresses of customers who registered in the year 2026 from the 'Customers' table.",
    example1: { input: "Customers = [('A','a@a.com','2026-01-01'),('B','a@a.com','2026-02-01')]", output: "['a@a.com']" },
    example2: { input: "Customers = []", output: "No records" },
    constraints: ["Emails must be unique (distinct)"],
    starterCode: "SELECT DISTINCT email FROM Customers ...",
    expectedSolution: "SELECT DISTINCT email FROM Customers WHERE registration_date >= '2026-01-01' AND registration_date <= '2026-12-31';"
  }
];

const fallbackDBMediumQuestions = [
  {
    question: "Top Spent Customers",
    statement: "Write a SQL query to join the 'Customers' (id, name) and 'Orders' (id, customer_id, amount) tables to find the names of the top 3 customers who spent the most money overall.",
    example1: { input: "Customers = [(1,'A'),(2,'B')], Orders = [(1,1,100),(2,1,200)]", output: "Customer A, total 300" },
    example2: { input: "Customers = [(1,'A')], Orders = []", output: "No results" },
    constraints: ["Return customer name and total spend", "Order descending by spend"],
    starterCode: "SELECT c.name, SUM(o.amount) ...",
    expectedSolution: "SELECT c.name, SUM(o.amount) AS total_spent FROM Customers c JOIN Orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY total_spent DESC LIMIT 3;"
  },
  {
    question: "Department Average Salary",
    statement: "Write a SQL query to find departments in the 'Employees' table that have an average salary of more than $60,000. Return department name and the average salary.",
    example1: { input: "Employees = [(1,'A',70000,'IT'),(2,'B',50000,'IT'),(3,'C',40000,'HR')]", output: "[('IT', 60000)]" },
    example2: { input: "Employees = []", output: "No results" },
    constraints: ["Group by department", "Filter groups using HAVING"],
    starterCode: "SELECT department, AVG(salary) ...",
    expectedSolution: "SELECT department, AVG(salary) AS avg_salary FROM Employees GROUP BY department HAVING AVG(salary) > 60000;"
  },
  {
    question: "Second Highest Salary",
    statement: "Write a SQL query to retrieve the second highest salary from the 'Employees' table. If there is no second highest, the query should return NULL.",
    example1: { input: "Employees = [(1,50000),(2,90000),(3,80000)]", output: "80000" },
    example2: { input: "Employees = [(1,50000)]", output: "null" },
    constraints: ["Handle distinct salary values"],
    starterCode: "SELECT DISTINCT salary FROM Employees ...",
    expectedSolution: "SELECT DISTINCT salary FROM Employees ORDER BY salary DESC LIMIT 1 OFFSET 1;"
  },
  {
    question: "Identify Duplicate Emails",
    statement: "Write a SQL query to find all duplicate email addresses from the 'Contacts' table. Return the email and the duplicate count.",
    example1: { input: "Contacts = [('a@a.com'),('b@b.com'),('a@a.com')]", output: "[('a@a.com', 2)]" },
    example2: { input: "Contacts = [('a@a.com')]", output: "No results" },
    constraints: ["Filter duplicate groups"],
    starterCode: "SELECT email, COUNT(*) ...",
    expectedSolution: "SELECT email, COUNT(email) AS count FROM Contacts GROUP BY email HAVING COUNT(email) > 1;"
  },
  {
    question: "Monthly Sales Revenue",
    statement: "Write a SQL query to compute the total sales revenue generated in each month of the year 2026. Return the month number (1-12) and total revenue.",
    example1: { input: "Orders = [(1, 100, '2026-01-15'), (2, 200, '2026-02-10')]", output: "[(1, 100), (2, 200)]" },
    example2: { input: "Orders = []", output: "No results" },
    constraints: ["Filter by year 2026", "Group by month"],
    starterCode: "SELECT MONTH(order_date) ...",
    expectedSolution: "SELECT EXTRACT(MONTH FROM order_date) AS month, SUM(amount) AS total_revenue FROM Orders WHERE order_date >= '2026-01-01' AND order_date <= '2026-12-31' GROUP BY EXTRACT(MONTH FROM order_date) ORDER BY month ASC;"
  }
];

const fallbackDBHardQuestions = [
  {
    question: "Consecutive Login Days",
    statement: "Write a SQL query to find the user_ids of users who logged in on 3 or more consecutive days. Assume a table 'Logins' with columns (id, user_id, login_date).",
    example1: { input: "Logins = [(1, 1, '2026-01-01'), (2, 1, '2026-01-02'), (3, 1, '2026-01-03')]", output: "[1]" },
    example2: { input: "Logins = [(1, 1, '2026-01-01'), (2, 1, '2026-01-03')]", output: "No results" },
    constraints: ["Return distinct user_ids"],
    starterCode: "SELECT DISTINCT user_id FROM ...",
    expectedSolution: "SELECT DISTINCT user_id FROM (SELECT user_id, login_date, LEAD(login_date, 1) OVER (PARTITION BY user_id ORDER BY login_date) AS next_date, LEAD(login_date, 2) OVER (PARTITION BY user_id ORDER BY login_date) AS next_next_date FROM Logins) t WHERE DATEDIFF(next_date, login_date) = 1 AND DATEDIFF(next_next_date, next_date) = 1;"
  },
  {
    question: "Rank Salary within Department",
    statement: "Write a SQL query to rank employee salaries within their respective departments. The highest salary should rank 1st. Return department name, employee name, salary, and their dense rank.",
    example1: { input: "Employees = [('Sales','A',9000),('Sales','B',9000),('IT','C',10000)]", output: "[('Sales','A',9000,1),('Sales','B',9000,1),('IT','C',10000,1)]" },
    example2: { input: "Employees = []", output: "No results" },
    constraints: ["Use dense ranking partition"],
    starterCode: "SELECT department, name, salary, DENSE_RANK() ...",
    expectedSolution: "SELECT department, name, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM Employees;"
  },
  {
    question: "Cumulative Sales Revenue",
    statement: "Write a SQL query to calculate the cumulative (running) total of sales revenue over time for the year 2026. Return order_date, daily_revenue, and running_total.",
    example1: { input: "Orders = [('2026-01-01',100),('2026-01-02',150)]", output: "[('2026-01-01',100,100),('2026-01-02',150,250)]" },
    example2: { input: "Orders = []", output: "No results" },
    constraints: ["Aggregate and order partition"],
    starterCode: "SELECT order_date, SUM(amount) ...",
    expectedSolution: "SELECT order_date, SUM(amount) AS daily_revenue, SUM(SUM(amount)) OVER (ORDER BY order_date) AS running_total FROM Orders WHERE order_date >= '2026-01-01' AND order_date <= '2026-12-31' GROUP BY order_date ORDER BY order_date ASC;"
  },
  {
    question: "Identify Non-Purchasing Customers",
    statement: "Write a SQL query to find customers who registered but have never placed an order. Return their name and email from the 'Customers' table. Do not use subqueries.",
    example1: { input: "Customers = [(1,'A','a@a.com')], Orders = []", output: "[('A','a@a.com')]" },
    example2: { input: "Customers = [(1,'A','a@a.com')], Orders = [(1,1,50)]", output: "No results" },
    constraints: ["Use LEFT JOIN and IS NULL conditions"],
    starterCode: "SELECT c.name, c.email FROM Customers c ...",
    expectedSolution: "SELECT c.name, c.email FROM Customers c LEFT JOIN Orders o ON c.id = o.customer_id WHERE o.id IS NULL;"
  },
  {
    question: "Managers with Direct Reports",
    statement: "Write a SQL query to find managers who manage at least 5 direct reporting employees. Return their names from the 'Employees' table. (Assume employee manager_id links to employee id).",
    example1: { input: "Employees = [(1,'Manager',Null),(2,'E1',1),(3,'E2',1),(4,'E3',1),(5,'E4',1),(6,'E5',1)]", output: "['Manager']" },
    example2: { input: "Employees = []", output: "No results" },
    constraints: ["Aggregate self join"],
    starterCode: "SELECT m.name FROM Employees m ...",
    expectedSolution: "SELECT m.name FROM Employees e JOIN Employees m ON e.manager_id = m.id GROUP BY m.id, m.name HAVING COUNT(e.id) >= 5;"
  }
];

const fallbackTheoryEasyQuestions = [
  "Explain the difference between a process and a thread.",
  "What is encapsulation in Object-Oriented Programming (OOP)?",
  "Explain the primary purpose of a primary key in a database.",
  "What are the main differences between TCP and UDP protocols?",
  "What does the 'this' keyword refer to in JavaScript or Java OOP?",
  "What is the difference between compiler and interpreter languages?",
  "What is the role and purpose of the Domain Name System (DNS)?",
  "Explain the programming concept of recursion.",
  "What is a foreign key in database relationships?",
  "Describe the difference between local and global variables."
];

const fallbackTheoryMediumQuestions = [
  "What are the ACID properties in database transactions?",
  "Explain the concept and significance of Virtual Memory in Operating Systems.",
  "How does method overriding differ from method overloading in OOP?",
  "Describe the three-way handshake process in TCP connections.",
  "What is the difference between REST APIs and SOAP protocols?",
  "Explain what SQL injection is and how to prevent it in queries.",
  "What is garbage collection in programming languages and how does it work?",
  "Explain the difference between stack and heap memory allocations.",
  "What are abstract classes and interfaces in OOP, and how do they differ?",
  "Explain the role of indexing in database search optimization."
];

const fallbackTheoryHardQuestions = [
  "Explain the CAP Theorem in distributed databases.",
  "How does the Operating System handle deadlock prevention, detection, and recovery?",
  "Describe how the SSL/TLS handshake establishes a secure communication channel.",
  "Explain the difference between pessimistic and optimistic locking strategies.",
  "What is database normalization, and explain the difference between 3NF and BCNF.",
  "How does load balancing work in large-scale distributed systems?",
  "Explain the concept of thread pools and concurrent executors.",
  "Describe how the OAuth 2.0 authorization code flow works.",
  "What is Cache Invalidation, and what are the major strategies used?",
  "Describe the internal structure and traversal of a B-Tree index in databases."
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
  const normLevel = level ? level.trim().toLowerCase() : 'easy';
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
    let pool = fallbackAIMLEasyQuestions;
    if (normLevel === 'hard') pool = fallbackAIMLHardQuestions;
    else if (normLevel === 'medium') pool = fallbackAIMLMediumQuestions;

    const randIdx = Math.floor(Math.random() * pool.length);
    return pool[randIdx];
  }
};

export const generateDBQuestion = async (type, level) => {
  const normLevel = level ? level.trim().toLowerCase() : 'easy';
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
    let pool = fallbackDBEasyQuestions;
    if (normLevel === 'hard') pool = fallbackDBHardQuestions;
    else if (normLevel === 'medium') pool = fallbackDBMediumQuestions;

    const randIdx = Math.floor(Math.random() * pool.length);
    return pool[randIdx];
  }
};

export const evaluateAnswer = async (question, code, language) => {
  if (isBoilerplateOrEmpty(code)) {
    return JSON.stringify({
      status: 'WRONG_ANSWER',
      passed: false,
      message: 'No solution code implemented. Please write your solution code before submitting.'
    });
  }
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
3. DO NOT fix or complete the logic of the code. However, assume all standard headers, imports, packages, and namespaces are already included (such as #include <vector>, #include <string>, #include <unordered_map>, #include <algorithm>, and using namespace std; for C++).
4. The user is writing only the solution function(s). Do not trigger COMPILE_ERROR for missing headers, imports, class Solution wrappers, class scopes, namespace declarations, or main functions.
5. If code incomplete inside the function body → COMPILE_ERROR
6. If syntax wrong inside the function body → COMPILE_ERROR
7. If runtime crash possible → RUNTIME_ERROR
8. If logic incorrect → WRONG_ANSWER

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

export const generateFeedback = async (question, code, language, starterCode = '') => {
  if (isBoilerplateOrEmpty(code, starterCode)) {
    return JSON.stringify({
      timeComplexity: '',
      spaceComplexity: '',
      codeQuality: 'Poor',
      score: 0,
      feedback: 'No solution code submitted, or the submitted code is empty/boilerplate. Please implement a valid solution.'
    });
  }
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
- Note: Assume standard libraries, imports, packages, and namespaces (like C++ vector, string, algorithm, using namespace std) are already included. The code only contains the functions implementing the logic, not main or class Solution wrappers.

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
    const extracted = extractJson(aiResponse);
    const parsed = JSON.parse(extracted);
    const fbLower = parsed.feedback ? parsed.feedback.toLowerCase() : '';
    const cqLower = parsed.codeQuality ? parsed.codeQuality.toLowerCase() : '';
    if (
      !parsed.feedback ||
      fbLower.includes('rate limit') ||
      fbLower.includes('busy') ||
      fbLower.includes('high volume') ||
      fbLower.includes('failed') ||
      fbLower.includes('quota') ||
      fbLower.includes('unavailable') ||
      fbLower.includes('temporarily') ||
      cqLower === 'error' ||
      cqLower === 'analysis pending'
    ) {
      throw new Error('AI response contains rate limits or error messages');
    }
    return extracted;
  } catch (error) {
    console.error('Feedback generation failed, using local fallback:', error.message);
    return generateLocalFallbackFeedback(question, code, language, starterCode);
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
    const normLevel = level ? level.trim().toLowerCase() : 'easy';
    if (normLevel === 'hard') return fallbackTheoryHardQuestions;
    if (normLevel === 'medium') return fallbackTheoryMediumQuestions;
    return fallbackTheoryEasyQuestions;
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
    const parsed = JSON.parse(clean);
    const fbLower = parsed.feedback ? parsed.feedback.toLowerCase() : '';
    if (
      !parsed.feedback ||
      fbLower.includes('unavailable') ||
      fbLower.includes('rate limit') ||
      fbLower.includes('busy') ||
      fbLower.includes('high volume') ||
      fbLower.includes('failed') ||
      fbLower.includes('quota') ||
      fbLower.includes('temporarily')
    ) {
      throw new Error('AI response contains rate limits or error messages');
    }
    return parsed;
  } catch (error) {
    console.error('Theory evaluation failed, using local fallback:', error.message);
    return evaluateTheoryLocalFallback(request);
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

// --- LOCAL FALLBACK HEURISTIC GENERATORS ---

export const isBoilerplateOrEmpty = (code, starterCode = '') => {
  const clean = (c) => {
    if (!c) return '';
    return c
      .replace(/\/\/.*|\/\*[\s\S]*?\*\/|#.*/g, '') // remove comments
      .replace(/\s+/g, '')                         // remove all whitespace
      .toLowerCase();
  };

  const cleanSubmitted = clean(code);
  const cleanStarter = clean(starterCode);

  // Case 1: If cleanSubmitted is empty or too short (e.g. fewer than 10 characters)
  if (!cleanSubmitted || cleanSubmitted.length < 10) {
    return true;
  }

  // Case 2: If cleanSubmitted matches cleanStarter exactly
  if (cleanStarter && cleanSubmitted === cleanStarter) {
    return true;
  }

  // Case 3: If cleanSubmitted is just a basic template (with empty function body)
  let stripped = cleanSubmitted;
  
  // Strip standard C++ headers and using namespace
  stripped = stripped
    .replace(/#include<[a-zA-Z0-9.]+>/g, '')
    .replace(/usingnamespacestd;/g, '');
    
  // Strip Java standard packages / class wrapper
  stripped = stripped
    .replace(/import\s+[a-zA-Z0-9._*]+;/g, '')
    .replace(/package\s+[a-zA-Z0-9._]+;/g, '');

  // Strip empty functions
  stripped = stripped
    .replace(/voidsolve\(\)\{\}/g, '')
    .replace(/intmain\(\)\{\}/g, '')
    .replace(/intmain\(\)\{return0;\}/g, '')
    .replace(/voidmain\(\)\{\}/g, '')
    .replace(/publicstaticvoidmain\(string\[\]args\)\{\}/g, '');
    
  // Strip class wrappers with empty methods if they are identical to empty templates
  if (cleanStarter) {
    const strippedStarter = cleanStarter
      .replace(/#include<[a-zA-Z0-9.]+>/g, '')
      .replace(/usingnamespacestd;/g, '')
      .replace(/import\s+[a-zA-Z0-9._*]+;/g, '')
      .replace(/package\s+[a-zA-Z0-9._]+;/g, '')
      .replace(/voidsolve\(\)\{\}/g, '')
      .replace(/intmain\(\)\{\}/g, '')
      .replace(/intmain\(\)\{return0;\}/g, '')
      .trim();
      
    if (stripped === strippedStarter) {
      return true;
    }
  }

  // If after stripping all headers and empty solve/main blocks, the code is empty, then it's boilerplate
  if (!stripped.trim() || stripped.trim() === '{}') {
    return true;
  }

  return false;
};

export const generateLocalFallbackFeedback = (question, code, language, starterCode = '') => {
  if (isBoilerplateOrEmpty(code, starterCode)) {
    return JSON.stringify({
      timeComplexity: '',
      spaceComplexity: '',
      codeQuality: 'Poor',
      score: 0,
      feedback: 'No solution code submitted, or the submitted code is empty/boilerplate. Please implement a valid solution.'
    });
  }
  
  const trimmedCode = code ? code.trim() : '';
  const withoutComments = trimmedCode.replace(/\/\/.*|\/\*[\s\S]*?\*\/|#.*/g, '').trim();

  // Count code constructs
  const codeLower = withoutComments.toLowerCase();
  
  // Detect loop structure (for, while)
  const forMatches = (codeLower.match(/\bfor\b/g) || []).length;
  const whileMatches = (codeLower.match(/\bwhile\b/g) || []).length;
  const loopCount = forMatches + whileMatches;
  
  // Simple heuristic for recursion / nested loops
  const isRecursive = codeLower.includes('helper') || (codeLower.includes('solve') && loopCount === 0);
  
  // Time Complexity heuristic
  let timeComplexity = 'O(1)';
  if (codeLower.includes('binary') || codeLower.includes('mid') || (codeLower.includes('low') && codeLower.includes('high'))) {
    timeComplexity = 'O(log N)';
  } else if (loopCount === 1) {
    timeComplexity = 'O(N)';
  } else if (loopCount > 1) {
    if (codeLower.includes('sort') || codeLower.includes('sorted')) {
      timeComplexity = 'O(N log N)';
    } else {
      timeComplexity = 'O(N^2)';
    }
  } else if (isRecursive) {
    timeComplexity = 'O(2^N)';
  }

  // Space Complexity heuristic
  let spaceComplexity = 'O(1)';
  if (
    codeLower.includes('vector') ||
    codeLower.includes('list') ||
    codeLower.includes('map') ||
    codeLower.includes('set') ||
    codeLower.includes('dict') ||
    codeLower.includes('hash') ||
    codeLower.includes('new ') ||
    (codeLower.includes('[') && codeLower.includes(']') && trimmedCode.length > 300)
  ) {
    spaceComplexity = 'O(N)';
  } else if (isRecursive) {
    spaceComplexity = 'O(N)';
  }

  // Score estimation
  let score = 75; // baseline for submitting compilable-looking code
  
  // Bonus points
  if (trimmedCode.includes('//') || trimmedCode.includes('/*') || trimmedCode.includes('#')) {
    score += 5;
  }
  if (withoutComments.length > 400) {
    score += 5;
  }
  if (codeLower.includes('try') && codeLower.includes('catch')) {
    score += 5;
  }
  
  // Deductions
  if (!codeLower.includes('return') && (language === 'cpp' || language === 'java' || language === 'python')) {
    score -= 10;
  }
  if (withoutComments.length < 50) {
    score = Math.min(score, 50);
  }

  // Clamp score
  score = Math.max(40, Math.min(95, score));

  // Determine code quality
  let codeQuality = 'Average';
  if (score >= 85) {
    codeQuality = 'Excellent';
  } else if (score >= 75) {
    codeQuality = 'Good';
  }

  // Prepare feedback message
  let feedback = "Evaluation completed using rule-based local grading due to AI connection limits. ";
  if (score >= 85) {
    feedback += "The solution is well-structured, modular, and handles the logic efficiently. Good use of naming conventions and clean programming practices.";
  } else if (score >= 70) {
    feedback += "The code successfully implements the core logic. To improve further, focus on code organization, handling extreme edge cases (like empty/negative inputs), and documenting major steps with comments.";
  } else {
    feedback += "The implementation contains basic logic but seems incomplete or needs refinement. Make sure to complete the function return statement and handle key edge cases.";
  }

  return JSON.stringify({
    timeComplexity,
    spaceComplexity,
    codeQuality,
    score,
    feedback
  });
};

export const evaluateTheoryLocalFallback = (request) => {
  const questions = request.questions || [];
  const answers = request.answers || [];
  const scores = [];
  let correctCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const ans = answers[i] || '';
    const cleanAns = ans.replace(/\[No Answer\]/gi, '').trim();
    
    // Heuristic: if answer is empty or too short, score is 0
    if (!cleanAns || cleanAns.length < 15) {
      scores.push(0);
    } else {
      scores.push(1);
      correctCount++;
    }
  }

  const baseScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  
  let feedback = "Evaluation completed using rule-based local grading due to AI connection limits. ";
  if (baseScore >= 80) {
    feedback += "Excellent job! You have demonstrated a clear and comprehensive understanding of the theory concepts. Most definitions and explanations are correct.";
  } else if (baseScore >= 50) {
    feedback += "Good effort. You understand the foundational concepts well, but some answers could benefit from more detailed explanations and standard terminology.";
  } else {
    feedback += "Your answers are either missing or too brief. We recommend reviewing the theoretical concepts and trying again with more detailed explanations.";
  }

  return {
    score: baseScore,
    feedback: feedback,
    scores: scores
  };
};

export const getLocalExpectedSolution = (questionStatement, language, starterCode) => {
  const statementLower = questionStatement ? questionStatement.toLowerCase() : '';
  const langLower = language ? language.toLowerCase().trim() : 'cpp';
  const starter = starterCode || '';

  // AI/ML & SQL fallback solutions map
  const fallbackSolutions = [
    {
      keywords: ['mean and median of features', 'mean_median', 'mean and median'],
      solution: `def mean_median(features):
    n = len(features)
    mean = sum(features) / n
    sorted_f = sorted(features)
    if n % 2 != 0:
        median = float(sorted_f[n // 2])
    else:
        median = (sorted_f[(n // 2) - 1] + sorted_f[n // 2]) / 2.0
    return (round(mean, 2), round(median, 2))`
    },
    {
      keywords: ['min-max feature scaling', 'normalize_data', 'min-max normalization', 'min-max'],
      solution: `def normalize_data(features):
    mn = min(features)
    mx = max(features)
    return [float(x - mn) / (mx - mn) for x in features]`
    },
    {
      keywords: ['accuracy score calculation', 'accuracy_score', 'accuracy of a classification model', 'accuracy of a classification'],
      solution: `def accuracy_score(y_true, y_pred):
    correct = sum(1 for yt, yp in zip(y_true, y_pred) if yt == yp)
    return float(correct) / len(y_true)`
    },
    {
      keywords: ['mean squared error', 'mean_squared_error'],
      solution: `def mean_squared_error(actual, predicted):
    squared_errors = [(act - pred) ** 2 for act, pred in zip(actual, predicted)]
    return sum(squared_errors) / len(actual)`
    },
    {
      keywords: ['leakyrelu', 'leaky_relu'],
      solution: `def leaky_relu(x, alpha=0.01):
    return [float(alpha * val) if val < 0 else float(val) for val in x]`
    },
    {
      keywords: ['k-nn euclidean distance', 'closest_point', 'euclidean distance from the query point', 'euclidean distance'],
      solution: `import math
def closest_point(query, points):
    min_dist = float('inf')
    closest_idx = -1
    for idx, pt in enumerate(points):
        dist = math.sqrt(sum((q - p) ** 2 for q, p in zip(query, pt)))
        if dist < min_dist:
            min_dist = dist
            closest_idx = idx
    return closest_idx`
    },
    {
      keywords: ['sigmoid and its derivative', 'sigmoid_and_derivative', 'sigmoid activation function and its derivative', 'sigmoid activation function'],
      solution: `import math
def sigmoid_and_derivative(x):
    s = 1.0 / (1.0 + math.exp(-x))
    ds = s * (1.0 - s)
    return (round(s, 2), round(ds, 2))`
    },
    {
      keywords: ['one-hot encoding', 'one_hot_encode', '2d one-hot encoded representation', 'one-hot encoded'],
      solution: `def one_hot_encode(labels, classes):
    class_map = {cls: idx for idx, cls in enumerate(classes)}
    result = []
    for label in labels:
        encoded = [0] * len(classes)
        if label in class_map:
            encoded[class_map[label]] = 1
        result.append(encoded)
    return result`
    },
    {
      keywords: ['z-score standardization', 'standardize', 'standardize a feature list by subtracting', 'standardize a feature list'],
      solution: `import math
def standardize(features):
    n = len(features)
    if n <= 1: return [float(x) for x in features]
    mean = sum(features) / n
    variance = sum((x - mean) ** 2 for x in features) / n
    std_dev = math.sqrt(variance)
    if std_dev == 0: return [float(x) for x in features]
    return [round((x - mean) / std_dev, 2) for x in features]`
    },
    {
      keywords: ['f1-score calculation', 'f1_score', 'compute the f1-score given', 'f1-score'],
      solution: `def f1_score(tp, fp, fn):
    if tp == 0: return 0.0
    precision = tp / (tp + fp)
    recall = tp / (tp + fn)
    if precision + recall == 0: return 0.0
    f1 = 2 * (precision * recall) / (precision + recall)
    return round(f1, 2)`
    },
    {
      keywords: ['linear regression gradient descent update', 'gradient_descent_step', 'updated weights (w) and bias (b)'],
      solution: `def gradient_descent_step(x, y, w, b, lr):
    n = len(x)
    grad_w = 0.0
    grad_b = 0.0
    for xi, yi in zip(x, y):
        pred = w * xi + b
        err = pred - yi
        grad_w += err * xi
        grad_b += err
    grad_w = (2 / n) * grad_w
    grad_b = (2 / n) * grad_b
    new_w = w - lr * grad_w
    new_b = b - lr * grad_b
    return (round(new_w, 2), round(new_b, 2))`
    },
    {
      keywords: ['stable softmax', 'stable_softmax', 'softmax function on a 1d list of floating', 'numerically stable'],
      solution: `import math
def stable_softmax(logits):
    mx = max(logits)
    exp_vals = [math.exp(x - mx) for x in logits]
    sum_exp = sum(exp_vals)
    return [round(ev / sum_exp, 2) for ev in exp_vals]`
    },
    {
      keywords: ['k-means centroid update', 'update_centroids', 'updated centroids list of tuples'],
      solution: `def update_centroids(points, labels):
    clusters = {}
    for pt, lbl in zip(points, labels):
        if lbl not in clusters:
            clusters[lbl] = []
        clusters[lbl].append(pt)
    centroids = []
    for lbl in sorted(clusters.keys()):
        pts = clusters[lbl]
        avg_x = sum(p[0] for p in pts) / len(pts)
        avg_y = sum(p[1] for p in pts) / len(pts)
        centroids.append((round(avg_x, 2), round(avg_y, 2)))
    return centroids`
    },
    {
      keywords: ['binary cross-entropy loss', 'bce_loss'],
      solution: `import math
def bce_loss(y_true, y_pred):
    loss = 0.0
    n = len(y_true)
    for yt, yp in zip(y_true, y_pred):
        yp = max(1e-15, min(1.0 - 1e-15, yp))
        loss += -1 * (yt * math.log(yp) + (1 - yt) * math.log(1 - yp))
    return round(loss / n, 2)`
    },
    {
      keywords: ['l2 regularization gradient', 'l2_gradient', 'ridge regression penalty'],
      solution: `def l2_gradient(w, lmbda):
    return [round(lmbda * val, 2) for val in w]`
    },
    {
      keywords: ['select active users', "status = 'active'", 'select * from users', 'active status'],
      solution: `SELECT * FROM Users WHERE status = 'active' ORDER BY name ASC;`
    },
    {
      keywords: ['count orders by customer', 'total_orders', 'total number of orders placed by each customer'],
      solution: `SELECT customer_id, COUNT(id) AS total_orders FROM Orders GROUP BY customer_id;`
    },
    {
      keywords: ['find employees with high salaries', 'salary > 80000', 'earn more than $80,000 per year', 'earn more than $80,000'],
      solution: `SELECT name FROM Employees WHERE salary > 80000;`
    },
    {
      keywords: ['list products by price', 'price >= 50', 'price is at least $50. sort by price descending', 'price is at least $50'],
      solution: `SELECT name, price FROM Products WHERE price >= 50 ORDER BY price DESC;`
    },
    {
      keywords: ['find customer emails', 'registration_date', 'registered in the year 2026 from the', 'registered in the year 2026'],
      solution: `SELECT DISTINCT email FROM Customers WHERE registration_date >= '2026-01-01' AND registration_date <= '2026-12-31';`
    },
    {
      keywords: ['top spent customers', 'total_spent', 'top 3 customers who spent the most money', 'top 3 customers who spent'],
      solution: `SELECT c.name, SUM(o.amount) AS total_spent FROM Customers c JOIN Orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY total_spent DESC LIMIT 3;`
    },
    {
      keywords: ['department average salary', 'avg_salary', 'average salary of more than $60,000'],
      solution: `SELECT department, AVG(salary) AS avg_salary FROM Employees GROUP BY department HAVING AVG(salary) > 60000;`
    },
    {
      keywords: ['second highest salary', 'second highest salary from the'],
      solution: `SELECT DISTINCT salary FROM Employees ORDER BY salary DESC LIMIT 1 OFFSET 1;`
    },
    {
      keywords: ['identify duplicate emails', 'contacts', 'duplicate email addresses from the', 'duplicate email addresses'],
      solution: `SELECT email, COUNT(email) AS count FROM Contacts GROUP BY email HAVING COUNT(email) > 1;`
    },
    {
      keywords: ['monthly sales revenue', 'monthly sales revenue', 'extract(month from order_date)', 'sales revenue generated in each month of the year 2026', 'sales revenue generated in each month'],
      solution: `SELECT EXTRACT(MONTH FROM order_date) AS month, SUM(amount) AS total_revenue FROM Orders WHERE order_date >= '2026-01-01' AND order_date <= '2026-12-31' GROUP BY EXTRACT(MONTH FROM order_date) ORDER BY month ASC;`
    },
    {
      keywords: ['consecutive login days', 'logins', 'logged in on 3 or more consecutive days'],
      solution: `SELECT DISTINCT user_id FROM (SELECT user_id, login_date, LEAD(login_date, 1) OVER (PARTITION BY user_id ORDER BY login_date) AS next_date, LEAD(login_date, 2) OVER (PARTITION BY user_id ORDER BY login_date) AS next_next_date FROM Logins) t WHERE DATEDIFF(next_date, login_date) = 1 AND DATEDIFF(next_next_date, next_date) = 1;`
    },
    {
      keywords: ['rank salary within department', 'dense_rank()', 'rank employee salaries within their respective departments', 'dense_rank'],
      solution: `SELECT department, name, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM Employees;`
    },
    {
      keywords: ['cumulative sales revenue', 'running_total', 'cumulative (running) total of sales revenue', 'cumulative (running) total'],
      solution: `SELECT order_date, SUM(amount) AS daily_revenue, SUM(SUM(amount)) OVER (ORDER BY order_date) AS running_total FROM Orders WHERE order_date >= '2026-01-01' AND order_date <= '2026-12-31' GROUP BY order_date ORDER BY order_date ASC;`
    },
    {
      keywords: ['identify non-purchasing customers', 'left join', 'registered but have never placed an order'],
      solution: `SELECT c.name, c.email FROM Customers c LEFT JOIN Orders o ON c.id = o.customer_id WHERE o.id IS NULL;`
    },
    {
      keywords: ['managers with direct reports', 'having count(e.id) >= 5', 'manage at least 5 direct reporting employees', 'managers who manage at least 5'],
      solution: `SELECT m.name FROM Employees e JOIN Employees m ON e.manager_id = m.id GROUP BY m.id, m.name HAVING COUNT(e.id) >= 5;`
    }
  ];

  for (const item of fallbackSolutions) {
    if (item.keywords.some(kw => statementLower.includes(kw))) {
      return item.solution;
    }
  }

  // 1. Two Sum
  if (statementLower.includes('two sum') || (statementLower.includes('indices') && statementLower.includes('add up to target'))) {
    if (langLower === 'python' || langLower === 'py') {
      return `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        m = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in m:
                return [m[complement], i]
            m[num] = i
        return []`;
    } else if (langLower === 'java') {
      return `import java.util.HashMap;
import java.util.Map;
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) return new int[] { map.get(complement), i };
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`;
    } else {
      return `#include <vector>
#include <unordered_map>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> m;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (m.count(complement)) return {m[complement], i};
            m[nums[i]] = i;
        }
        return {};
    }
};`;
    }
  }

  // 2. Contains Duplicate
  if (statementLower.includes('contains duplicate') || (statementLower.includes('appears at least twice') && statementLower.includes('distinct'))) {
    if (langLower === 'python' || langLower === 'py') {
      return `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        return len(nums) != len(set(nums))`;
    } else if (langLower === 'java') {
      return `import java.util.HashSet;
import java.util.Set;
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) {
            if (set.contains(x)) return true;
            set.add(x);
        }
        return false;
    }
}`;
    } else {
      return `#include <vector>
#include <unordered_set>
using namespace std;
class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> s;
        for (int x : nums) {
            if (s.count(x)) return true;
            s.insert(x);
        }
        return false;
    }
};`;
    }
  }

  // 3. Valid Parentheses
  if (statementLower.includes('valid parentheses') || (statementLower.includes('parentheses') && statementLower.includes('isValid'))) {
    if (langLower === 'python' || langLower === 'py') {
      return `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`;
    } else if (langLower === 'java') {
      return `import java.util.Stack;
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') stack.push(c);
            else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }
}`;
    } else {
      return `#include <string>
#include <stack>
using namespace std;
class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`;
    }
  }

  // 4. Container With Most Water
  if (statementLower.includes('container') || statementLower.includes('most water') || statementLower.includes('maxarea')) {
    if (langLower === 'python' || langLower === 'py') {
      return `class Solution:
    def maxArea(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        ans = 0
        while l < r:
            h = min(height[l], height[r])
            ans = max(ans, h * (r - l))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return ans`;
    } else if (langLower === 'java') {
      return `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1;
        int ans = 0;
        while (l < r) {
            int h = Math.min(height[l], height[r]);
            int w = r - l;
            ans = Math.max(ans, h * w);
            if (height[l] < height[r]) l++;
            else r--;
        }
        return ans;
    }
}`;
    } else {
      return `#include <vector>
#include <algorithm>
using namespace std;
class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int ans = 0;
        while (l < r) {
            int h = min(height[l], height[r]);
            int w = r - l;
            ans = max(ans, h * w);
            if (height[l] < height[r]) l++;
            else r--;
        }
        return ans;
    }
};`;
    }
  }

  // 5. 3Sum
  if (statementLower.includes('3sum') || statementLower.includes('three sum') || (statementLower.includes('triplets') && statementLower.includes('nums[i] + nums[j] + nums[k] == 0'))) {
    if (langLower === 'python' || langLower === 'py') {
      return `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        ans = []
        nums.sort()
        for i in range(len(nums)):
            if i > 0 and nums[i] == nums[i-1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s < 0:
                    l += 1
                elif s > 0:
                    r -= 1
                else:
                    ans.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l+1]:
                        l += 1
                    while l < r and nums[r] == nums[r-1]:
                        r -= 1
                    l += 1
                    r -= 1
        return ans`;
    } else if (langLower === 'java') {
      return `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> ans = new ArrayList<>();
        Arrays.sort(nums);
        for (int i = 0; i < nums.length; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum < 0) l++;
                else if (sum > 0) r--;
                else {
                    ans.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                }
            }
        }
        return ans;
    }
}`;
    } else {
      return `#include <vector>
#include <algorithm>
using namespace std;
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>> ans;
        sort(nums.begin(), nums.end());
        for (int i = 0; i < nums.size(); i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum < 0) l++;
                else if (sum > 0) r--;
                else {
                    ans.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                }
            }
        }
        return ans;
    }
};`;
    }
  }

  // 6. Longest Substring Without Repeating Characters
  if (statementLower.includes('longest substring') || statementLower.includes('repeating characters') || statementLower.includes('lengthoflongestsubstring')) {
    if (langLower === 'python' || langLower === 'py') {
      return `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        m = {}
        l, ans = 0, 0
        for r, char in enumerate(s):
            if char in m:
                l = max(l, m[char] + 1)
            m[char] = r
            ans = max(ans, r - l + 1)
        return ans`;
    } else if (langLower === 'java') {
      return `import java.util.HashMap;
import java.util.Map;
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int l = 0, ans = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (map.containsKey(c)) l = Math.max(l, map.get(c) + 1);
            map.put(c, r);
            ans = Math.max(ans, r - l + 1);
        }
        return ans;
    }
}`;
    } else {
      return `#include <string>
#include <vector>
#include <algorithm>
using namespace std;
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<int> m(256, -1);
        int l = 0, ans = 0;
        for (int r = 0; r < s.size(); r++) {
            if (m[s[r]] != -1) l = max(l, m[s[r]] + 1);
            m[s[r]] = r;
            ans = max(ans, r - l + 1);
        }
        return ans;
    }
};`;
    }
  }

  // 7. Trapping Rain Water
  if (statementLower.includes('trapping') || statementLower.includes('rain water') || statementLower.includes('trap')) {
    if (langLower === 'python' || langLower === 'py') {
      return `class Solution:
    def trap(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        ans = 0
        left_max, right_max = 0, 0
        while l < r:
            if height[l] < height[r]:
                if height[l] >= left_max:
                    left_max = height[l]
                else:
                    ans += left_max - height[l]
                l += 1
            else:
                if height[r] >= right_max:
                    right_max = height[r]
                else:
                    ans += right_max - height[r]
                  r -= 1
        return ans`;
    } else if (langLower === 'java') {
      return `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int ans = 0, left_max = 0, right_max = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= left_max) left_max = height[l];
                else ans += (left_max - height[l]);
                l++;
            } else {
                if (height[r] >= right_max) right_max = height[r];
                else ans += (right_max - height[r]);
                r--;
            }
        }
        return ans;
    }
}`;
    } else {
      return `#include <vector>
#include <algorithm>
using namespace std;
class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int ans = 0, left_max = 0, right_max = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                height[l] >= left_max ? left_max = height[l] : ans += (left_max - height[l]);
                l++;
            } else {
                height[r] >= right_max ? right_max = height[r] : ans += (right_max - height[r]);
                r--;
            }
        }
        return ans;
    }
};`;
    }
  }

  // 8. Median of Two Sorted Arrays
  if (statementLower.includes('median') || (statementLower.includes('two sorted arrays') && statementLower.includes('findmediansortedarrays'))) {
    if (langLower === 'python' || langLower === 'py') {
      return `class Solution:
    def findMedianSortedArrays(self, A: list[int], B: list[int]) -> float:
        if len(A) > len(B):
            A, B = B, A
        na, nb = len(A), len(B)
        l, r = 0, na
        while l <= r:
            i = (l + r) // 2
            j = (na + nb + 1) // 2 - i
            maxLeftA = float('-inf') if i == 0 else A[i-1]
            minRightA = float('inf') if i == na else A[i]
            maxLeftB = float('-inf') if j == 0 else B[j-1]
            minRightB = float('inf') if j == nb else B[j]
            if maxLeftA <= minRightB and maxLeftB <= minRightA:
                if (na + nb) % 2 != 0:
                    return max(maxLeftA, maxLeftB)
                return (max(maxLeftA, maxLeftB) + min(minRightA, minRightB)) / 2.0;
            elif maxLeftA > minRightB:
                r = i - 1
            else:
                l = i + 1
        return 0.0`;
    } else if (langLower === 'java') {
      return `class Solution {
    public double findMedianSortedArrays(int[] A, int[] B) {
        int na = A.length, nb = B.length;
        if (na > nb) return findMedianSortedArrays(B, A);
        int l = 0, r = na;
        while (l <= r) {
            int i = (l + r) / 2;
            int j = (na + nb + 1) / 2 - i;
            int maxLeftA = (i == 0) ? Integer.MIN_VALUE : A[i-1];
            int minRightA = (i == na) ? Integer.MAX_VALUE : A[i];
            int maxLeftB = (j == 0) ? Integer.MIN_VALUE : B[j-1];
            int minRightB = (j == nb) ? Integer.MAX_VALUE : B[j];
            if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
                if ((na + nb) % 2 != 0) return Math.max(maxLeftA, maxLeftB);
                return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2.0;
            } else if (maxLeftA > minRightB) r = i - 1;
            else l = i + 1;
        }
        return 0.0;
    }
}`;
    } else {
      return `#include <vector>
#include <algorithm>
using namespace std;
class Solution {
public:
    double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
        int na = A.size(), nb = B.size();
        if (na > nb) return findMedianSortedArrays(B, A);
        int l = 0, r = na;
        while (l <= r) {
            int i = (l + r) / 2;
            int j = (na + nb + 1) / 2 - i;
            int maxLeftA = (i == 0) ? INT_MIN : A[i-1];
            int minRightA = (i == na) ? INT_MAX : A[i];
            int maxLeftB = (j == 0) ? INT_MIN : B[j-1];
            int minRightB = (j == nb) ? INT_MAX : B[j];
            if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
                if ((na + nb) % 2 != 0) return max(maxLeftA, maxLeftB);
                return (max(maxLeftA, maxLeftB) + min(minRightA, minRightB)) / 2.0;
            } else if (maxLeftA > minRightB) r = i - 1;
            else l = i + 1;
        }
        return 0.0;
    }
};`;
    }
  }

  // 9. Edit Distance
  if (statementLower.includes('edit distance') || (statementLower.includes('operations required to convert') && statementLower.includes('mindistance'))) {
    if (langLower === 'python' || langLower === 'py') {
      return `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1): dp[i][0] = i
        for j in range(n + 1): dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i-1] == word2[j-1]:
                    dp[i][j] = dp[i-1][j-1]
                else:
                    dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
        return dp[m][n]`;
    } else if (langLower === 'java') {
      return `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i-1][j], Math.min(dp[i][j-1], dp[i-1][j-1]));
                }
            }
        }
        return dp[m][n];
    }
}`;
    } else {
      return `#include <string>
#include <vector>
#include <algorithm>
using namespace std;
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i-1] == word2[j-1]) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
                }
            }
        }
        return dp[m][n];
    }
};`;
    }
  }

  // 10. Merge k Sorted Lists
  if (statementLower.includes('merge k') || statementLower.includes('mergeklists')) {
    if (langLower === 'python' || langLower === 'py') {
      return `import heapq
class Solution:
    def mergeKLists(self, lists: list[ListNode]) -> ListNode:
        h = []
        for i, lst in enumerate(lists):
            if lst:
                heapq.heappush(h, (lst.val, i, lst))
        dummy = ListNode(0)
        curr = dummy
        while h:
            val, idx, node = heapq.heappop(h)
            curr.next = ListNode(val)
            curr = curr.next
            if node.next:
                heapq.heappush(h, (node.next.val, idx, node.next))
        return dummy.next`;
    } else if (langLower === 'java') {
      return `import java.util.PriorityQueue;
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode node : lists) {
            if (node != null) pq.add(node);
        }
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            curr.next = new ListNode(node.val);
            curr = curr.next;
            if (node.next != null) pq.add(node.next);
        }
        return dummy.next;
    }
}`;
    } else {
      return `#include <vector>
#include <queue>
using namespace std;
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
        for (auto l : lists) {
            if (l) pq.push(l);
        }
        ListNode dummy(0);
        ListNode* curr = &dummy;
        while (!pq.empty()) {
            auto node = pq.top(); pq.pop();
            curr->next = new ListNode(node->val);
            curr = curr->next;
            if (node->next) pq.push(node->next);
        }
        return dummy.next;
    }
};`;
    }
  }

  // Fallback to starter code with comment
  return starter || `// Optimal reference solution placeholder for: \${questionStatement.substring(0, 40)}`;
};
