# CodeSprint

CodeSprint is a full-stack competitive programming and coding evaluation platform similar to LeetCode. It features an interactive coding workspace, multi-language compiler integration, real-time feedback, algorithmic problem databases, leaderboards, and an AI-powered code reviewer.

---

## Architecture Overview

The application is split into two primary components:

1.  **Frontend:** A single-page React application built with Vite, styled with custom Vanilla CSS, and integrated with the Monaco Editor for writing code.
2.  **Backend:** An Express.js Node.js server that acts as a REST API, interfacing with MongoDB for data persistence, JDoodle for secure remote code execution, and Google Gemini AI for code review.

---

## Core Features

*   **User Management:** Authentication and profile configuration, containing bio, locations, bookmarks, and links to professional profiles (GitHub, LinkedIn).
*   **Problems Repository:** A categorized database of programming problems classified by difficulty (Easy, Medium, Hard) and tags, complete with editorials and test cases.
*   **Interactive Code Workspace:** Integration with Monaco Editor for syntax highlighting and tab behavior. Users can run code against sample test cases or submit code for final validation.
*   **Remote Code Execution:** Secure compilation and execution of submissions across multiple programming languages powered by the JDoodle API.
*   **AI Code Reviewer:** Integrated Google Gemini API to analyze submitted code, calculate time/space complexities, and suggest optimization strategies.
*   **Leaderboard System:** Live rankings calculated using successful submissions and total user points.
*   **Discussion Boards:** A comment-based discussion system on a per-problem basis for collaborative learning.
*   **Administrative Utilities:** Administrative dashboard to manage problems, create new challenges, configure test cases, and manage users.

---

## Technical Stack

*   **Frontend:** React, Vite, React Router, Monaco Editor, Lucide Icons, Axios.
*   **Backend:** Node.js, Express.js, Mongoose (MongoDB ODM), JSON Web Tokens (JWT), Bcrypt.js.
*   **Third-Party Services:** JDoodle API (Compiler), Google Gemini API (AI Code Insights), MongoDB Atlas (Cloud Database).

---

## Directory Structure

```text
CodeSprint/
├── backend/                  # Express API server
│   ├── controllers/          # Request handlers
│   ├── data/                 # Sample seed data
│   ├── middleware/           # Auth and error middleware
│   ├── routes/               # API endpoints
│   ├── models.js             # Mongoose schemas
│   ├── seed.js               # Database seeding script
│   └── server.js             # Entry point
├── frontend/                 # Vite + React client
│   ├── public/               # Static assets
│   └── src/                  # React source files
│       ├── api/              # Axios configuration
│       ├── components/       # Reusable UI components
│       ├── context/          # Context API providers (Auth, Theme)
│       └── pages/            # View pages
└── package.json              # Project workspace package configuration
```

---

## Configuration and Setup

### Prerequisites

*   Node.js (version 18 or higher recommended)
*   MongoDB (local instance running on port 27017 or a MongoDB Atlas URI)
*   JDoodle API credentials (Client ID and Client Secret)
*   Google Gemini API Key

---

### Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder and populate the variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/codesprint
   JWT_SECRET=your_jwt_secret_key
   JDOODLE_CLIENT_ID=your_jdoodle_client_id
   JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Populate the database with initial problem data:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run server
   ```

---

### Frontend Configuration

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## Production Deployment

### Database
Host the MongoDB database using MongoDB Atlas. Whitelist the IP address `0.0.0.0/0` in MongoDB Atlas Network Access settings to accept connections from dynamic cloud backend instances.

### Backend (e.g., Render)
Deploy the `backend` folder as a Node Web Service. Provide the necessary environment variables (`MONGO_URI`, `JWT_SECRET`, `JDOODLE_CLIENT_ID`, `JDOODLE_CLIENT_SECRET`, `GEMINI_API_KEY`) in the service settings.

### Frontend (e.g., Vercel)
Deploy the `frontend` folder. Set the environment variable `VITE_API_URL` to your backend's deployed endpoint (e.g., `https://your-backend.onrender.com/api`) in Vercel before initiating the build process.
