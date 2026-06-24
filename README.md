# LifeVault — Social Media App

A full-stack social media web application built with the MERN stack (MongoDB, Express, React, Node.js). Users can sign up with a profile picture, create posts with images, interact through likes and comments, and manage friendships.

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
- [Files You Can Delete](#files-you-can-delete)
- [Known Limitations](#known-limitations)

---

## Features

| Area | What it does |
|---|---|
| **Auth** | Sign up, log in, log out, forgot password, reset password |
| **Posts** | Create posts with text and/or an image, edit your own posts, delete |
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
│   │   ├── comments.js             # Create comment, toggle comment like
│   │   ├── friends.js              # Get friends list, send friend request
│   │   ├── friendRequests.js       # Send / accept / decline / remove
│   │   ├── passwordReset.js        # Request reset token, apply new password
│   │   ├── posts.js                # Get all posts, create post, toggle post like
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
│   │   │   ├── Post.jsx            # Post card with comments and comment likes
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
│   │       ├── friends.js          # getFriends(), etc.
│   │       └── friendRequests.js
│   ├── tests/                      # Vitest + Testing Library tests
│   │   ├── components/             # Post, LikeButton, Navbar tests
│   │   ├── pages/                  # Page-level render and interaction tests
│   │   └── services/               # Service function unit tests
│   ├── .env                        # Local frontend env (VITE_API_URL)
│   ├── .env.test                   # Test env (VITE_BACKEND_URL)
│   ├── vitest.setup.js             # Global test setup
│   ├── vite.config.js              # Vite + Vitest config
│   └── package.json
│
├── docs/                           # Architecture diagrams and markdown docs
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

You must install separately for the backend and frontend — they are independent Node projects.

```bash
# Backend
cd api
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Create environment variable files

See the [Environment Variables](#environment-variables) section below for exactly what to put in each file.

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

You do not need to change this file unless you want to use Atlas for tests.

### Frontend — `frontend/.env`

Create this file at `frontend/.env`:

```
VITE_API_URL="http://localhost:3000"
```

This tells the React app where to send API requests. Update this to your deployed backend URL when you deploy.

---

## Running the App

You need **two terminal windows** running at the same time.

### Terminal 1 — start the backend

```bash
cd api
npm run dev
```

The API will be available at `http://localhost:3000`. The `dev` script uses `node --watch` so it restarts automatically when you save a file.

### Terminal 2 — start the frontend

```bash
cd frontend
npm run dev
```

The React app will be available at `http://localhost:5173`.

### First steps once it's running

1. Go to `http://localhost:5173/signup` and create an account
2. Log in at `http://localhost:5173/login`
3. You'll land on the Feed — create a post, like it, add a comment, like the comment
4. Navigate to your Profile to confirm posts, comments and likes all appear correctly there too

---

## Running the Tests

### Backend tests (Jest + Supertest)

```bash
cd api
npm test
```

Tests connect to the `acebook_test` database defined in `api/.env.test`. Each test file cleans up its own data in `beforeEach` / `afterAll`. You do **not** need the backend dev server running — Jest boots the Express app internally via Supertest.

Test files live under `api/tests/`:

| File | What it covers |
|---|---|
| `controllers/authentication.test.js` | Login endpoint — valid credentials, wrong password, missing user |
| `controllers/comments.test.js` | Create comment, like/unlike comment, auth enforcement |
| `controllers/posts.test.js` | Create post, get posts, like/unlike post |
| `controllers/users.test.js` | Register, get profile, search users |
| `controllers/friends.test.js` | Get friends list |
| `controllers/friendRequests.test.js` | Friend request routes exist and require auth |
| `controllers/passwordReset.test.js` | Request reset token, apply new password |
| `models/*.test.js` | Schema validation and constraints for each model |
| `lib/token.test.js` | JWT generation and expiry |
| `app.test.js` | Route mounting smoke test |

### Frontend tests (Vitest + Testing Library)

```bash
cd frontend
npm test
```

Runs in watch mode by default. Press `q` to quit. You do **not** need the dev server running — all network calls are mocked.

Test files live under `frontend/tests/`:

| File | What it covers |
|---|---|
| `components/post.test.jsx` | Post rendering, edit post, comment display, comment like state |
| `components/likeButton.test.jsx` | Like button toggle behaviour |
| `components/navBar.test.jsx` | Nav links render correctly |
| `pages/loginPage.test.jsx` | Login form, navigation, forgot password link |
| `pages/signupPage.test.jsx` | Signup form validation and navigation |
| `pages/feedPage.test.jsx` | Feed renders, post form present |
| `pages/profilePage.test.jsx` | Profile loads via mocked fetch, friend request buttons appear |
| `pages/homePage.test.jsx` | Home page renders correctly |
| `pages/friendsPage.test.jsx` | Friends page heading present |
| `pages/FriendRequestsPage.test.jsx` | Friend requests page renders |
| `pages/PasswordReset.test.jsx` | Password reset page renders |
| `services/authentication.test.js` | login() and signup() service functions |
| `services/posts.test.js` | getPosts() service function |
| `services/users.test.js` | getUser() service function |
| `services/friends.test.js` | Friends service functions |

---

## API Reference

All routes prefixed with `/` relative to `http://localhost:3000`.

Routes marked **Auth required** expect the header: `Authorization: Bearer <token>`

The token is returned by `POST /tokens` on login and refreshed on most authenticated responses. Store it in `localStorage` and send it with every protected request.

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
| `POST` | `/users/friendRequest/:requestId/accept` | Yes | — | Accept the incoming request from `:requestId` |
| `POST` | `/users/friendRequest/:requestId/reject` | Yes | — | Delete the incoming request from `:requestId` |
| `POST` | `/users/:id/unfriend` | Yes | — | Remove user `:id` from your friends |

### Posts

| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| `GET` | `/posts` | Yes | — | Get all posts (newest first) with comments attached |
| `POST` | `/posts` | Yes | `{ message, image }` | Create a post (`image` is a Cloudinary URL string) |
| `POST` | `/posts/:id/like` | Yes | — | Toggle like on post `:id` |
| `POST` | `/posts/:id/comments` | Yes | `{ message }` | Add a comment to post `:id` |
| `POST` | `/posts/:id/comments/:commentId/like` | Yes | — | Toggle like on comment `:commentId` |

### Friends

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/friends` | Yes | Get the logged-in user's friends list |
| `POST` | `/friends/request/:id` | Yes | Send a friend request (alternative route) |

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
| `POST` | `/passwordReset/request` | No | `{ email }` | Generate a reset token (printed to server console in dev) |
| `POST` | `/passwordReset/reset` | No | `{ token, password }` | Apply a new password using the token |

---

## Authentication Flow

1. User logs in via `POST /tokens` with email and password
2. Server verifies the password with `bcrypt.compare` against the stored hash
3. On success, the server returns a **JWT** signed with `JWT_SECRET`, expiring in 10 minutes
4. The frontend stores the token in `localStorage` under the key `token`, and the user's MongoDB `_id` under `userId`
5. Every protected request sends `Authorization: Bearer <token>` in the header
6. The `tokenChecker` middleware verifies the JWT and attaches `req.user_id` for use in controllers
7. Most protected responses return a **refreshed token** so the session stays alive during normal use

**Logging out** clears `localStorage` and redirects to the home page — no server call is needed since tokens are stateless.

---

## Image Uploads

Profile pictures and post images are handled differently:

### Profile pictures (on signup)
- The signup form sends a `multipart/form-data` request to `POST /users`
- The `cloudinaryConfig.js` multer middleware intercepts the file and uploads it directly to Cloudinary
- The resulting Cloudinary HTTPS URL is stored in the `User.profilePic` field in MongoDB

### Post images (on feed)
- The frontend uploads the image **directly to Cloudinary** from the browser using Cloudinary's unsigned upload preset
- Once Cloudinary returns the URL, the frontend sends `POST /posts` with the URL as the `image` field
- This avoids routing large files through your own server

To set up your own Cloudinary upload preset for post images:
1. Log in to Cloudinary → Settings → Upload → Upload Presets
2. Create an **unsigned** preset
3. Update the preset name and cloud name in `frontend/src/pages/Feed/FeedPage.jsx`

---

## Password Reset Flow

Because this app has no email sending service configured, the reset token is printed to the **backend server console** during development. The flow is:

1. User clicks **Forgot Password?** on the login page → goes to `/forgot-password`
2. Enters their email address → frontend calls `POST /passwordReset/request`
3. The server generates a secure random token (valid for 15 minutes) and logs it to the console: `RESET TOKEN (email@example.com): <token>`
4. The user copies the token from the console (or you can wire up an email provider like SendGrid here)
5. User enters the token and their new password on the same page → frontend calls `POST /passwordReset/reset`
6. The server validates the token, hashes the new password, and updates the user record

To add real email sending, add your provider's SDK to `api/controllers/passwordReset.js` inside the `requestReset` function where the `console.log` currently is.

---

## Deployment (Render)

The `render.yaml` file at the root configures two services on [Render](https://render.com):

| Service | Type | Root dir | Start command |
|---|---|---|---|
| `lifevault-api` | Web service (Node) | `api/` | `npm start` |
| `lifevault-frontend` | Static site | `frontend/` | `npm run build` |

### Steps to deploy

1. Push your code to GitHub
2. Create a new account or log in at [render.com](https://render.com)
3. Click **New → Blueprint** and connect your GitHub repository — Render will detect `render.yaml` automatically
4. Set the following environment variables on the `lifevault-api` service in the Render dashboard (they are marked `sync: false` in `render.yaml` so you must set them manually):
   - `MONGODB_URL` — your MongoDB Atlas connection string
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `JWT_SECRET` is auto-generated by Render
5. Once both services are deployed, update `frontend/.env` with the actual backend URL and redeploy the frontend:
   ```
   VITE_API_URL="https://lifevault-api.onrender.com"
   ```

**Note:** Free Render services spin down after 15 minutes of inactivity. The first request after a spin-down can take 30–60 seconds.

---

## Known Limitations

- **No email delivery** — password reset tokens are printed to the server console. A real deployment should integrate an email provider (SendGrid, Resend, etc.)
- **Token expiry is short** — JWTs expire in 10 minutes. The app refreshes them on each API response, but if a user is idle for more than 10 minutes they will be logged out on their next action
- **No image deletion** — images uploaded to Cloudinary are never deleted, even if the user updates their profile picture or deletes a post