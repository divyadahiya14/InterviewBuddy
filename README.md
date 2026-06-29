# InterviewBuddy 🤖

An advanced, AI-powered diagnostic mockup platform designed to help engineers practice coding challenges, master theoretical concepts, and schedule real-world simulated interviews with expert mentors. 

### 🌐 Live Deployments
* **Frontend Web App:** [https://interview-buddy-bay.vercel.app](https://interview-buddy-bay.vercel.app)
* **Backend API Server:** [https://interviewbuddy-87jz.onrender.com](https://interviewbuddy-87jz.onrender.com)

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
* **Database:** MongoDB, Mongoose ODM (Cloud hosted on MongoDB Atlas)
* **Security:** JSON Web Tokens (JWT), BCryptJS
* **Integrations:** Google Gemini AI API, Brevo SMTP (Transactional Email API), Razorpay API

### 🚀 Deployment & Hosting
* **Frontend Web App Hosting:** Vercel
* **Backend Web Service Hosting:** Render
* **Cloud Database Cluster:** MongoDB Atlas

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

## 📂 Directory Structure

Here is the folder structure for both the frontend and backend components of the project:

```text
InterviewBuddy/
├── interviewbuddy-backend/         # Node.js + Express Backend Server
│   ├── config/                     # Database & API Configurations
│   ├── controllers/                # Request Handlers & Business Logic
│   ├── middleware/                 # JWT Authentication & Request Logging Guard
│   ├── models/                     # Mongoose Schema Models (User, Report, Booking, etc.)
│   ├── routes/                     # Express Router Definitions
│   ├── services/                   # Business Services & External Integrations (Gemini, Brevo, Razorpay)
│   ├── utils/                      # Helper Scripts & Formatting Utilities
│   ├── .env                        # Local Environment Config Variables
│   ├── server.js                   # Main Entrypoint Server File
│   └── package.json                # Dependencies & Server Scripts
└── interviewbuddy-frontend/        # React + Tailwind CSS Frontend Client
    ├── public/                     # Static assets, favicon, HTML index
    ├── src/
    │   ├── components/             # Reusable UI Components (Navbar, ProtectedRoute, etc.)
    │   ├── pages/                  # Page Components & Router Views
    │   ├── services/               # Axios API Client config & Authentication Services
    │   ├── styles/                 # Tailwind CSS directives & global styling
    │   ├── App.js                  # App routing & component mounting
    │   ├── firebase.js             # Firebase Client initialization (Google Sign-In configuration)
    │   └── index.js                # Core JS mount configuration
    ├── .env.local                  # Local React Environment Config Variables
    └── package.json                # Client dependencies & scripts
```

---

## 🔌 Backend API Endpoints

All API endpoints are prefixed with `/api`. Here is a complete list of the available routes and their functions:

### 🔑 Authentication Routes (`/api/auth`)
* `GET /users` - Fetch list of all registered users (debug/admin).
* `POST /register` - Create a new user account.
* `POST /login` - Standard email/password user login.
* `POST /google-login` - Google Authentication user registration / session login.
* `GET /me` - Get current authenticated user profile session.
* `POST /logout` - Log out current user & clear secure cookie session.
* `POST /send-otp` - Trigger 2FA/Password recovery OTP email validation.
* `POST /verify-otp` - Verify the reset OTP token.
* `POST /reset-password` - Reset account password with verified token.
* `PUT /profile` - Edit user credentials or profile particulars.

### 🤖 AI Interview Routes (`/api/ai/interview`)
* `GET /question` - Retrieve a target coding question based on topic & difficulty.
* `POST /evaluate` - Analyze DSA/ML code correctness, runtime metrics, complexity.
* `POST /feedback` - Compile AI breakdown & structured recommendations.
* `POST /theoryQuestions` - Request 10 customized interview questions on a selected topic.
* `POST /theory-feedback` - Grade verbal responses to selected theory questions.
* `POST /hint` - Generate dynamic assistance hints based on code editor context.
* `POST /save-report` - Persist completed interview diagnostics reports.

### 📄 Resume Analysis Routes (`/api/resume`)
* `POST /upload` - Process uploaded PDF resume to extract topics & build custom quiz.
* `GET /latest` - Retrieve current resume questions.

### 💳 Booking Routes (`/api/booking`)
* `POST /create-order` - Initiate Razorpay checkout order request.
* `POST /confirm` - Confirm session checkout booking & trigger email invitations.
* `GET /interviewer` - Get appointments for the logged-in interviewer.
* `GET /candidate` - Get appointments for the logged-in candidate.

### 💼 Interviewer Routes (`/api/interviewer`)
* `GET /by-email` - Get details of an interviewer by email query parameters.
* `PUT /` - Modify profile parameters, rates, or credentials.
* `GET /all` - Fetch all active verified interviewers.
* `PATCH /availability` - Edit weekly booking time-slots.
* `POST /:id/rate` - Add a feedback rating review to an interviewer profile.

### 🎓 Candidate Routes (`/api/candidate`)
* `GET /:email/profile` - Fetch candidate statistics, streaks, and completed reports.
* `GET /report/:id` - Fetch details of a specific diagnostic report.
* `POST /report/:id/retry` - Force retry generating an AI assessment report.
* `DELETE /report/:id` - Delete a diagnostic report.
* `DELETE /booking/:id` - Cancel a mentor session appointment booking.
* `GET /debug-reports` - Admin utility to list all database reports.

---

## 📄 License
This project is licensed under the MIT License.
