# InterviewBuddy 🤖

An advanced, AI-powered diagnostic mockup platform designed to help engineers practice coding challenges, master theoretical concepts, and schedule real-world simulated interviews with expert mentors. 

---

## 📸 Website Screenshots

Below is a visual walkthrough of the platform. You can replace these placeholder image links with actual screenshots of your running application:

### 1. Landing Page
<p align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Landing+Page+Mockup" alt="Landing Page" width="800" />
</p>

### 2. Candidate Interview Workspace
<p align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Coding+Interview+Workspace+Mockup" alt="Coding Environment" width="800" />
</p>

### 3. Interviewer Dashboard
<p align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Interviewer+Dashboard+Mockup" alt="Interviewer Dashboard" width="800" />
</p>

### 4. Detailed AI Performance Report
<p align="center">
  <img src="https://via.placeholder.com/800x450.png?text=AI+Feedback+Report+Mockup" alt="Detailed Feedback Page" width="800" />
</p>

---

## 🚀 Key Features

* **AI Coding Evaluator (DSA & ML):** Practice algorithm and machine learning coding challenges. Features real-time code execution assessments (LeetCode-style judge), dynamic helper hints, complexity metrics (`O(N)` estimations), and a **Model Expected Code** panel.
* **AI Theory Interviewer:** Simulates a professional verbal questionnaire. Generates 10 targeted theory questions based on difficulty (DBMS, Fundamentals, Web, AI-ML) and automatically grades candidate answers.
* **Robust Offline Fallbacks:** Automatically switches to heuristic local grading models during Google Gemini API rate limits (`429`) or network offline timeouts. Enforces level-specific fallback questions mapped to local reference solutions.
* **Human Mock Booking Engine:** Connects candidates with expert mentors. Features availability calendars, secure checkout with **Razorpay**, automated confirmation emails with **Brevo**, and a dedicated dashboard to join video calls.
* **Authentication & Guard Security:** Secured by JWT HTTP-only cookies and Authorization Headers. Enforces role-based route protection guards (`ProtectedRoute`) on the React client side.
* **Visual Dashboard Analytics:** Highlights streaks, total mock sessions, performance categories, and scoring graphs.

---

## 🛠️ Technology Stack

### Frontend
* **Core:** React, React Router Dom (v7)
* **Styling & Design:** Tailwind CSS, Framer Motion (for premium liquid-glass animations), Lucide React Icons
* **Code Editor:** Monaco Editor
* **HTTP Client:** Axios (configured with credit credentials interceptors)

### Backend
* **Core:** Node.js, Express (ES Modules)
* **Database:** MongoDB, Mongoose ODM
* **Security:** JSON Web Tokens (JWT), BCryptJS
* **Integrations:** Google Gemini AI API, Brevo SMTP (Transactional Email API), Razorpay API

---

## 💻 Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas cloud URI)
* [Firebase Account](https://console.firebase.google.com/) (For Google Sign-In setup)

---

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/divyadahiya14/InterviewBuddy.git
cd InterviewBuddy

# Install Backend dependencies
cd interviewbuddy-backend
npm install

# Install Frontend dependencies
cd ../interviewbuddy-frontend
npm install
```

---

### Step 2: Configure Environment Variables

#### Backend (`interviewbuddy-backend/.env`)
Create a `.env` file in the backend root directory:
```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/interview_buddy
JWT_SECRET=your_super_long_secret_key
AI_API_KEY=your_gemini_api_key
AI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent
BREVO_API_KEY=your_brevo_smtp_api_key
BREVO_SENDER_EMAIL=sender@example.com
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Frontend (`interviewbuddy-frontend/.env.local`)
Create a `.env.local` file in the frontend root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_API_URL=http://localhost:8080/api
```

---

### Step 3: Run the Application Locally

```bash
# In backend directory:
npm run dev

# In frontend directory:
npm start
```
* **Frontend Access:** `http://localhost:3000`
* **Backend API server:** `http://localhost:8080`

---

## 📄 License
This project is licensed under the MIT License.
