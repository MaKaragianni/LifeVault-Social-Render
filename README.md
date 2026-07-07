# LifeVault — Social Media App

A full-stack social media web application built with the MERN stack (MongoDB, Express, React, Node.js). Users can sign up with a profile picture, create posts with images, interact through likes and comments, and manage friendships.

---

This started as a team project at Makers Academy 2026, which I then continued developing solo. About 40% of the final codebase comes from the original legacy codebase and team-phase build (branding, color palette, CSS, and auth handling) — of which roughly two-thirds is my own team-phase work (navbar/routing, profile page, user display, and post functionality). My colleagues had also built a friends-following feature during the team phase, which I removed and replaced with my own friend-request system. Everything else was removed, added, or substantially rewritten by me afterwards.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Running the Tests](#running-the-tests)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Image Uploads](#image-uploads)
- [Password Reset Flow](#password-reset-flow)
- [Deployment (Render)](#deployment-render)
- [Known Limitations](#known-limitations)

---

## Features

| Area | What it does |
|---|---|
| **Auth** | Sign up, log in, log out, forgot password, reset password |
| **Posts** | Create posts with text and/or an image, edit your own posts including changing or removing the image, delete |
| **Post likes** | Like and unlike any post; count updates instantly |
| **Comments** | Add comments to any post, edit your own comments |
| **Comment likes** | Like and unlike comments; likes are persisted in the database and visible to all users |
| **Profiles** | View any user's profile with bio, profile picture, and their posts |
| **Profile editing** | Edit your own username and bio |
| **Friends** | Send friend requests, confirm or delete incoming requests, unfriend |
| **User search** | Search for other users by username via the navbar search bar |

---

## Tech Stack

### Backend (`api/`)
| Package | Purpose |
|---|---|
| Node.js + Express | HTTP server and routing |
| MongoDB + Mongoose | Database and ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT-based authentication |
| Cloudinary + multer-storage-cloudinary | Profile picture uploads |
| helmet | Security headers |
| express-rate-limit | Rate limiting |
| Jest + Supertest | Backend testing |

### Frontend (`frontend/`)
| Package | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Vite | Dev server and bundler |
| Vitest + Testing Library | Frontend testing |

---

## Project Structure

```
├── api/                            # Express backend
│   ├── app.js                      # Express app (middleware + routes)
│   ├── index.js                    # Server entry point (starts listening)
│   ├── cloudinaryConfig.js         # Cloudinary + multer upload config
│   ├── controllers/
│   │   ├── authentication.js       # POST /tokens — login
│   │   ├── comments.js             # Create comment, edit comment, toggle comment like
│   │   ├── friends.js              # Get friends list
│   │   ├── friendRequests.js       # Send / accept / decline / remove
│   │   ├── passwordReset.js        # Request reset token, apply new password
│   │   ├── posts.js                # Get all posts, create post, update post, toggle post like
│   │   └── users.js                # Register, get profile, search, friend actions
│   ├── models/
│   │   ├── comment.js              # message, user, post, likes[]
│   │   ├── FriendRequest.js        # sender, receiver, status
│   │   ├── PasswordResetToken.js   # userId, token, expiresAt
│   │   ├── post.js                 # message, image, user, likes[]
│   │   └── user.js                 # email, password, username, dob, profilePic, bio, friends[], friendRequests[]
│   ├── routes/                     # Express routers (one file per resource)
│   ├── middleware/
│   │   └── tokenChecker.js         # JWT verification middleware
│   ├── lib/
│   │   └── token.js                # JWT generation helper
│   ├── db/
│   │   └── db.js                   # Mongoose connection
│   ├── tests/
│   │   ├── controllers/            # Supertest integration tests
│   │   ├── models/                 # Mongoose model unit tests
│   │   ├── lib/                    # Token helper tests
│   │   ├── app.test.js             # Route mounting smoke tests
│   │   └── mongodb_helper.js       # Test DB connection setup
│   ├── .env                        # Local secrets (never commit)
│   ├── .env.test                   # Test DB config
│   └── package.json
│
├── frontend/                       # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx                # React entry point
│   │   ├── components/
│   │   │   ├── Post.jsx            # Post card with edit image, comments and comment likes
│   │   │   ├── likeButton.jsx      # Post like / unlike button
│   │   │   ├── Navbar.jsx          # Top navigation bar + search
│   │   │   ├── SearchBar.jsx       # Username search component
│   │   │   ├── User.jsx            # User summary card
│   │   │   └── LogoutButton.jsx    # Clears localStorage and redirects
│   │   ├── pages/
│   │   │   ├── Feed/FeedPage.jsx           # Timeline of all posts + create post form
│   │   │   ├── Profile/ProfilePage.jsx     # User profile, their posts, friend actions
│   │   │   ├── Login/LoginPage.jsx         # Login form + forgot password link
│   │   │   ├── Signup/SignupPage.jsx        # Registration form with profile pic upload
│   │   │   ├── Home/HomePage.jsx           # Landing page (unauthenticated)
│   │   │   ├── Friends/FriendsPage.jsx     # Friends list
│   │   │   ├── FriendRequests/FriendRequestsPage.jsx
│   │   │   └── Password/
│   │   │       ├── ForgotPasswordPage.jsx  # Step 1: request token; Step 2: set new password
│   │   │       └── ResetPasswordPage.jsx
│   │   └── services/               # Fetch wrapper functions for each API resource
│   │       ├── authentication.js   # login(), signup()
│   │       ├── posts.js            # getPosts()
│   │       ├── createPost.js       # createPost()
│   │       ├── users.js            # getUser()
│   │       ├── friends.js          # getFriends()
│   │       └── friendRequests.js
│   ├── tests/                      # Vitest + Testing Library tests
│   ├── .env.test                   # Test env (VITE_BACKEND_URL=http://localhost:3000)
│   ├── vitest.setup.js             # Global test setup
│   ├── vite.config.js              # Vite + Vitest config
│   └── package.json
│
├── render.yaml                     # Render.com deployment config
└── README.md
```

---

## Prerequisites

Make sure you have these installed before starting:

- **Node.js v20+** — install via [nvm](https://github.com/nvm-sh/nvm):
  ```bash
  brew install nvm          # macOS
  nvm install 20
  nvm use 20
  ```
- **MongoDB v8** — local installation:
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community@8.0
  brew services start mongodb-community@8.0
  ```
  Or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster instead.

- **A Cloudinary account** — free at [cloudinary.com](https://cloudinary.com). You need the cloud name, API key, and API secret from your dashboard.

- **Git**

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install dependencies

Install separately for the backend and frontend — they are independent Node projects.

```bash
# Backend
cd api
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Create environment variable files

See the [Environment Variables](#environment-variables) section below.

---

## Environment Variables

### Backend — `api/.env`

Create this file at `api/.env`. It is already in `.gitignore` and must never be committed.

```
MONGODB_URL="mongodb://0.0.0.0/acebook"
JWT_SECRET="any-long-random-string-you-choose"
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

| Variable | Where to get it |
|---|---|
| `MONGODB_URL` | Use the local value shown above, or paste your Atlas connection string |
| `JWT_SECRET` | Any secret string — make it long and random in production |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard → Settings → Account |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | Same place as API key |

### Backend test environment — `api/.env.test`

This already exists in the repo and points to a separate local test database so tests never touch your real data:

```
MONGODB_URL="mongodb://0.0.0.0/acebook_test"
JWT_SECRET=test_secret
```

### Frontend test environment — `frontend/.env.test`

This already exists in the repo and is used by Vitest:

```
VITE_BACKEND_URL=http://localhost:3000
```

> **Note:** There is no `frontend/.env` file needed for local development. The frontend reads `VITE_BACKEND_URL` at Vite build time. Locally, it falls back to `http://localhost:3000` automatically. For production, `VITE_BACKEND_URL` is set as an environment variable on the Render static site service — see [Deployment](#deployment-render).

---

## Running the App

You need **two terminal windows** running at the same time.

### Terminal 1 — start the backend

```bash
cd api
npm run dev
```

The API will be available at `http://localhost:3000`.

### Terminal 2 — start the frontend

```bash
cd frontend
npm run dev
```

The React app will be available at `http://localhost:5173`.

### First steps once it's running

1. Go to `http://localhost:5173/signup` and create an account
2. Log in at `http://localhost:5173/login`
3. Create a post, like it, add a comment, like the comment
4. Try editing a post — you can change the text, swap the image, or remove it entirely
5. Navigate to your Profile to confirm posts, comments and likes all appear correctly

---

## Running the Tests

### Backend tests (Jest + Supertest)

```bash
cd api
npm test
```

Tests connect to the `acebook_test` database defined in `api/.env.test`. You do **not** need the backend dev server running.

### Frontend tests (Vitest + Testing Library)

```bash
cd frontend
npm test
```

Runs in watch mode. Press `q` to quit. All network calls are mocked — no dev server needed.

---

## API Reference

All routes are relative to `http://localhost:3000`.

Routes marked **Auth required** expect: `Authorization: Bearer <token>`

### Authentication

| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/tokens` | No | `{ email, password }` | Log in. Returns `{ token, userId }` |

### Users

| Method | Route | Auth | Body / Query | Description |
|---|---|---|---|---|
| `POST` | `/users` | No | `FormData: email, password, confirmPassword, username, dateOfBirth, bio, profilePic` | Register a new user |
| `GET` | `/users/:id` | No | — | Get a user's profile and their posts |
| `GET` | `/users/search?username=` | Yes | Query param `username` | Search users by username (partial match) |
| `POST` | `/users/:id/friendRequest` | Yes | — | Send a friend request to user `:id` |
| `POST` | `/users/friendRequest/:requestId/accept` | Yes | — | Accept the incoming request |
| `POST` | `/users/friendRequest/:requestId/reject` | Yes | — | Delete the incoming request |
| `POST` | `/users/:id/unfriend` | Yes | — | Remove user `:id` from your friends |

### Posts

| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| `GET` | `/posts` | Yes | — | Get all posts (newest first) with comments attached |
| `POST` | `/posts` | Yes | `{ message, image }` | Create a post |
| `PUT` | `/posts/:id` | Yes | `{ message?, image? }` | Update a post's text and/or image (owner only) |
| `POST` | `/posts/:id/like` | Yes | — | Toggle like on post `:id` |
| `POST` | `/posts/:id/comments` | Yes | `{ message }` | Add a comment to post `:id` |
| `PUT` | `/posts/:id/comments/:commentId` | Yes | `{ message }` | Edit a comment (owner only) |
| `POST` | `/posts/:id/comments/:commentId/like` | Yes | — | Toggle like on comment `:commentId` |

### Friends

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/friends` | Yes | Get the logged-in user's friends list |

### Friend Requests

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/friendRequests/request/:userId` | Yes | Send a friend request |
| `GET` | `/friendRequests/requests` | Yes | Get incoming friend requests |
| `PUT` | `/friendRequests/accept/:requestId` | Yes | Accept a request |
| `PUT` | `/friendRequests/decline/:requestId` | Yes | Decline a request |
| `DELETE` | `/friendRequests/remove/:friendId` | Yes | Remove a friend |

### Password Reset

| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/passwordReset/request` | No | `{ email }` | Generate a reset token (logged to server console in dev) |
| `POST` | `/passwordReset/reset` | No | `{ token, password }` | Apply a new password using the token |

---

## Authentication Flow

1. User logs in via `POST /tokens` with email and password
2. Server verifies the password with `bcrypt.compare` against the stored hash
3. On success the server returns a **JWT** signed with `JWT_SECRET`, expiring in 10 minutes
4. The frontend stores the token in `localStorage` under `token`, and the user's MongoDB `_id` under `userId`
5. Every protected request sends `Authorization: Bearer <token>` in the header
6. The `tokenChecker` middleware verifies the JWT and attaches `req.user_id` for use in controllers
7. Most protected responses return a **refreshed token** so the session stays alive during normal use

**Logging out** clears `localStorage` and redirects to the home page — no server call needed.

---

## Image Uploads

### Profile pictures (on signup)
- The signup form sends a `multipart/form-data` request to `POST /users`
- The `cloudinaryConfig.js` multer middleware intercepts the file and uploads it directly to Cloudinary
- The resulting Cloudinary HTTPS URL is stored in `User.profilePic` in MongoDB

### Post images (on feed and edit)
- The frontend uploads the image **directly to Cloudinary** from the browser using an unsigned upload preset
- Once Cloudinary returns the URL, the frontend sends `POST /posts` (create) or `PUT /posts/:id` (edit) with the URL as the `image` field
- To remove an image when editing, the frontend sends `PUT /posts/:id` with `image: ""`
- This avoids routing large files through the server

To set up your own Cloudinary upload preset for post images:
1. Log in to Cloudinary → Settings → Upload → Upload Presets
2. Create an **unsigned** preset
3. Update the preset name and cloud name at the top of `frontend/src/components/Post.jsx` and `frontend/src/pages/Feed/FeedPage.jsx`

---

## Password Reset Flow

The reset token is printed to the **backend server console** during development (no email service is configured). The flow is:

1. User clicks **Forgot Password?** → goes to `/forgot-password`
2. Enters their email → frontend calls `POST /passwordReset/request`
3. Server generates a secure random token (valid for 15 minutes) and logs it: `RESET TOKEN (email@example.com): <token>`
4. User copies the token from the console and enters it along with their new password
5. Frontend calls `POST /passwordReset/reset` → server validates, hashes the new password, updates the user record

To add real email sending, wire up a provider (SendGrid, Resend, etc.) inside `api/controllers/passwordReset.js` where the `console.log` currently is.

---

## Deployment (Render)

The `render.yaml` at the root configures two services:

| Service | Type | Root dir | Command |
|---|---|---|---|
| `lifevault-api` | Web service (Node) | `api/` | `npm start` |
| `lifevault-frontend` | Static site | `frontend/` | `npm run build` |

### Steps to deploy

1. Push your code to GitHub
2. Log in at [render.com](https://render.com) → **New → Blueprint** → connect your repository
3. Set the following environment variables manually on the `lifevault-api` service in the Render dashboard (they are `sync: false` in `render.yaml`):
   - `MONGODB_URL` — your MongoDB Atlas connection string
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `JWT_SECRET` is auto-generated by Render
4. Ensure `VITE_BACKEND_URL` is set on the `lifevault-frontend` static site service pointing to your API URL (e.g. `https://lifevault-api-plie.onrender.com`)
5. In MongoDB Atlas → Network Access, allow access from anywhere (`0.0.0.0/0`) so Render's dynamic IPs can connect

**Note:** Free Render services spin down after 15 minutes of inactivity. The first request after a spin-down can take 30–60 seconds.

---

## Known Limitations

- **No email delivery** — password reset tokens are printed to the server console. A real deployment should integrate an email provider (SendGrid, Resend, etc.)
- **Token expiry is short** — JWTs expire in 10 minutes. The app refreshes them on each API response, but if a user is idle for more than 10 minutes they will be logged out on their next action
- **No image deletion from Cloudinary** — images uploaded to Cloudinary are never deleted from the CDN, even if the user removes them from a post or updates their profile picture
