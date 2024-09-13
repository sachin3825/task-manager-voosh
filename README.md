# Task Manager Application - Full Stack Monorepo

This is a full-stack task management application built as part of a Full-Stack Developer Challenge. It allows users to create, update, and manage tasks, drag-and-drop them between columns, and authenticate with Google OAuth. This monorepo consists of both the frontend and backend applications, which are connected to work seamlessly.

## Features

- Drag-and-drop functionality for task management.
- Google OAuth for authentication.
- Full CRUD operations for tasks (Create, Read, Update, Delete).
- Email notifications (using Nodemailer).
- Image upload and storage with Cloudinary.
- Frontend validation with Zod for form inputs.
- Backend validation with Zod.
- User authentication and session management.
- Error handling and validation on both frontend and backend.

## Tech Stack

### Frontend:
- Vite
- React
- Redux & RTK (Redux Toolkit)
- TailwindCSS
- Google OAuth for authentication

### Backend:
- Node.js with Express
- MongoDB (for database)
- Nodemailer (for sending emails)
- Cloudinary (for image uploads)
- Zod (for validation)

## Installation

### Prerequisites:
- Node.js installed locally.
- MongoDB instance running.
- Cloudinary account for storing images.

### Steps to Install and Run:

1. Clone the repository:

```bash
git clone https://github.com/sachin3825/task-manager-voosh.git
```

2. Navigate to the root directory:

```bash
cd task-manager-voosh
```

3. Install dependencies for the monorepo (root, frontend, and backend):

```bash
npm install
```

4. Navigate to both `frontend` and `backend` directories and install dependencies individually:

```bash
cd frontend
npm install

cd ../backend
npm install
```

5. Set up environment variables:

- Create a `.env` file in the root of your `backend` folder.
- Add the required environment variables (replace `<values>` with your own):

```env
PORT=<port>
MONGO_URL=<your-mongo-url>
MAIL_HOST=<your-mail-host>
MAIL_USER=<your-mail-username>
MAIL_PASS=<your-mail-password>
FROM_NAME=<your-sender-name>
JWT_SECRET=<your-jwt-secret>
CLOUD_NAME=<your-cloudinary-cloud-name>
API_KEY=<your-cloudinary-api-key>
API_SECRET=<your-cloudinary-api-secret>
FOLDER_NAME=<your-cloudinary-folder-name>
```

- Create a `.env` file in the `frontend` folder and add the following variables:

```env
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

6. Start the development server for both frontend and backend from the root:

```bash
npm start
```

This will concurrently run both the frontend (on Vite) and the backend (on Express).

### Frontend:
Runs on [http://localhost:5173](http://localhost:5173)

### Backend:
Runs on [http://localhost:5000](http://localhost:5000)

## Project Structure

```bash
task-manager-voosh/
│
├── backend/               # Backend (Node.js with Express)
│   ├── config/            # Config files for database, JWT, etc.
│   ├── controller/        # Request handling logic for tasks, users
│   ├── middleware/        # Custom middleware (e.g., authentication)
│   ├── models/            # MongoDB models (User, Task)
│   ├── routes/            # API routes (users, tasks)
│   ├── uploads/           # Image uploads (via Cloudinary)
│   ├── utils/             # Utility functions (e.g., error handling)
│   ├── .env               # Environment variables
│   └── index.js           # Entry point for the backend
│
├── frontend/              # Frontend (React with Vite)
│   ├── public/            # Public assets (e.g., favicon)
│   └── src/               # Source files for the frontend
│       ├── assets/        # Static assets like images
│       ├── components/    # Reusable components (e.g., TaskCard, Column)
│       ├── hooks/         # Custom React hooks
│       ├── pages/         # Pages (e.g., Login, Dashboard)
│       ├── store/         # Redux store and slices
│       ├── App.jsx        # Main app component
│       ├── index.css      # Global styles
│       └── main.jsx       # Entry point for React
│
├── .gitignore             # Git ignored files
├── eslint.config.js       # ESLint configuration
├── index.html             # Root HTML file for Vite
├── package-lock.json      # Lockfile for package versions
├── package.json           # Package manager configuration for dependencies
├── postcss.config.js      # PostCSS configuration (for Tailwind)
├── README.md              # Project documentation
├── tailwind.config.js     # TailwindCSS configuration
├── vercel.json            # Vercel configuration for deployment
└── vite.config.js         # Vite configuration
```

## How It Works

### Frontend:
- The frontend is built using Vite and React with Redux Toolkit (RTK) for state management.
- Google OAuth has been integrated using `react-oauth/google`, allowing users to sign in via Google.
- Task management features like adding, editing, and moving tasks are implemented using a drag-and-drop library.
- TailwindCSS is used for styling to ensure the UI is responsive and modern.
- Zod is used for frontend form validation to ensure data integrity before it’s sent to the backend.

### Backend:
- The backend is built using Node.js and Express, with MongoDB as the database to store user and task data.
- Routes for user authentication (including Google OAuth), task management, and image uploads are handled using RESTful API endpoints.
- The backend uses Zod for validation to ensure incoming data is structured and valid.
- Nodemailer has been integrated to send email notifications upon user registration or task creation.
- Cloudinary is used to store task-related images, and its API is integrated into the application for easy uploads.

## API Endpoints

- **User Routes:**
  - `POST /api/v1/user/login`: Logs in a user.
  - `POST /api/v1/user/send-otp`: Sends OTP to the user for verification.
  - `POST /api/v1/user/signup`: Registers a new user.
  - `PATCH /api/v1/user/avatar`: Updates user profile avatar (requires authentication).
  - `GET /api/v1/user/me`: Fetches the logged-in user's profile information.

- **Task Routes:**
  - `POST /api/v1/task`: Creates a new task.
  - `GET /api/v1/task`: Fetches all tasks.
  - `GET /api/v1/task/:id`: Fetches task details by task ID.
  - `PATCH /api/v1/task/:id`: Updates task details.
  - `DELETE /api/v1/task/:id`: Deletes a task by task ID.

- The API routes are grouped using an API router under `/api/v1`, where user routes are handled at `/user` and task routes at `/task`.

## Environment Variables

Ensure the following environment variables are set in the `.env` file in your backend and frontend folders:

### Backend `.env`:
```env
PORT=<port>
MONGO_URL=<your-mongo-url>
MAIL_HOST=<your-mail-host>
MAIL_USER=<your-mail-username>
MAIL_PASS=<your-mail-password>
FROM_NAME=<your-sender-name>
JWT_SECRET=<your-jwt-secret>
CLOUD_NAME=<your-cloudinary-cloud-name>
API_KEY=<your-cloudinary-api-key>
API_SECRET=<your-cloudinary-api-secret>
FOLDER_NAME=<your-cloudinary-folder-name>
```

### Frontend `.env`:
```env
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

These environment variables are essential for connecting to MongoDB, securing JWT tokens, sending emails via Nodemailer, storing images via Cloudinary, and authenticating users via Google.

## Additional Information

- For styling, TailwindCSS is configured and integrated with Vite for fast reloads and development.
- Redux Toolkit (RTK) is used for state management, allowing for simple and scalable state management for task data.
- Zod is used in both the frontend and backend for form validation, ensuring that user input is clean and secure.
- Nodemailer is used to send out emails to users after registration, helping to maintain user engagement.

