# BlogSpace

BlogSpace is a full-stack MERN blogging platform where users can register, write blog posts using a markdown editor, add tags, and interact through comments.

## Features

- **Authentication:** JWT-based user registration and login with bcrypt password hashing.
- **Markdown Editor:** Create and edit posts using a rich markdown editor (`@uiw/react-md-editor`).
- **Tags & Search:** Filter posts by clicking tags, or use the debounced search bar on the home feed.
- **Comments:** Logged-in users can comment on posts and delete their own comments.
- **Dashboard:** A personalized dashboard to manage your own posts.
- **Premium Design:** Modern UI with glassmorphism, dark theme, and micro-animations.

## Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Vanilla CSS with custom properties.
- **Backend:** Node.js, Express.js, express-validator.
- **Database:** MongoDB & Mongoose.
- **Security:** `jsonwebtoken`, `bcryptjs`.

## Local Setup

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (running locally on port 27017, or a MongoDB Atlas URI)

### 2. Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Check the `.env` file (it defaults to `mongodb://localhost:27017/blogspace`).
4. Start the server: `npm run dev` (Runs on `http://localhost:5000`)

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev` (Runs on `http://localhost:5173`)

## API Endpoints Summary

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate
- `GET /api/posts` - Get all posts (with search, sort, pagination)
- `POST /api/posts` - Create post (Protected)
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post (Protected)
- `DELETE /api/posts/:id` - Delete post (Protected)
- `GET /api/posts/tag/:tag` - Filter by tag
- `GET /api/posts/user/:userId` - Filter by user
- `POST /api/comments/:postId` - Add comment (Protected)

## Deployment

- **Frontend:** Ready for Vercel (push the `/client` folder).
- **Backend:** Ready for Render (push the `/server` folder and set `.env` variables).
- **Database:** Setup a free tier MongoDB Atlas cluster and set `MONGO_URI`.
