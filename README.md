# BlogSpace

BlogSpace is a full-stack MERN (MongoDB, Express, React, Node.js) blogging platform. It allows users to register, write rich markdown posts, follow other authors, and interact through likes and comments. It features a complete Admin Dashboard for moderation, along with comprehensive data validations and cascading deletes.

## 🚀 Features

- **Robust Authentication:** JWT-based user registration and login with bcrypt password hashing. Includes strong password validation (min 8 chars, uppercase, number, special char).
- **Admin Dashboard:** Special `admin` role with a dedicated dashboard to view all users and posts. Admins can perform cascading deletes (removing a user also cleans up their posts, comments, likes, and followers).
- **Social Network:** Follow your favorite authors, view your followers/following lists on your profile, and browse a dedicated "Following" feed on the homepage.
- **Interactions:** Like posts, save bookmarks, and leave comments.
- **Markdown Editor:** Create and edit posts using a rich markdown editor (`@uiw/react-md-editor`).
- **Tags & Search:** Filter posts by clicking tags, sort by latest/likes/views, or use the real-time search bar.
- **Premium Design:** Modern, responsive UI with glassmorphism, dark theme, fluid layouts, and micro-animations.

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Vanilla CSS with custom properties, Lucide React (icons).
- **Backend:** Node.js, Express.js, express-validator.
- **Database:** MongoDB & Mongoose.
- **Security:** `jsonwebtoken`, `bcryptjs`.

## 📦 Local Setup

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (running locally on port 27017, or a MongoDB Atlas URI)

### 2. Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Configure your `.env` file in the `/server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ADMIN_EMAIL=admin@blogspace.com
   ADMIN_PASSWORD=Admin@Secure2025!
   ```
4. Start the server: `npm run dev` (Runs on `http://localhost:5000`)
5. *(Optional)* Run `node scripts/seed.js` from the `/server` directory to populate the database with fake users and posts.

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev` (Runs on `http://localhost:5173`)

## 🛣️ Core API Endpoints

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
- **Users:** `GET /api/users/:id`, `PUT /api/users/profile`, `POST /api/users/:id/follow`, `DELETE /api/users/:id` (Admin)
- **Posts:** `GET /api/posts`, `GET /api/posts/feed`, `POST /api/posts`, `PUT /api/posts/:id`, `DELETE /api/posts/:id`
- **Comments:** `POST /api/comments/:postId`, `DELETE /api/comments/:id`

## 🚀 Deployment

- **Frontend:** Ready to be deployed on platforms like **Vercel** or **Netlify**. Simply connect your GitHub repository and point the build directory to the `client` folder.
- **Backend:** Ready to be deployed on platforms like **Render**, **Heroku**, or **Railway**. Connect your repository, set the build directory to the `server` folder, and make sure to inject all the variables from your `.env` file into the platform's environment variables settings.
- **Database:** Use a cloud provider like **MongoDB Atlas** for production.
