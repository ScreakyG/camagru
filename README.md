# Camagru

<div align="center">
  <img src="./instagram_old_logo.png" alt="Camagru Logo" width="200">
  <p>A light social media app</p>
</div>

## Description

Camagru is a instagram like web app that allow users to take live pictures with their webcam, tweak them then post them.
</br>


## TODO:
- Swap JWT for Session Token in DB (authentication).

## Preview
<div align="center">
  <img alt="image" src="https://github.com/user-attachments/assets/0afac1ab-6122-458e-a70f-5892cee0bb21" width=700 />
</div>

At the moment users can :
- Create a account with mail verification ✅
- Request new password link if forgot ✅
- Edit their email / username / password ✅

- Takes pictures ✅
- Edit pictures ✅
- Like , comment posts ✅
- Feed with all users content ✅
- Set notifications ✅

## 🛠️ Stack

### Backend
- **Node.js**
- **Fastify**
- **SQLite** -> will be migrating to another later
- **Nodemailer**

### Frontend
- **HTML5/CSS3**
- **JavaScript**
- **TailwindCSS**
- **DaisyUI**

### Deployment
- **Docker/Docker Compose**
- **Nginx**

## MCD

<div align="center">
  <img width="1491" height="1100" alt="image" src="https://github.com/user-attachments/assets/28738dbc-6a80-4e5f-92cf-d10d44985ec5" />
</div>


## Containers overview

<div align="center">
  <img alt="image" src="https://github.com/user-attachments/assets/2d0f7b44-a8a6-418f-ad97-1f46e1a39be7" width=700/>
</div>

**Nginx** :
  - Load static files
  - Reverse proxy "/api/XXX/XX" API's calls to Fastify container

**Fastify** is a REST API :
  - Handle all endpoints starting with /api/
  - Handle connection to the database

## API Endpoints and HTTP codes

| Method | Endpoint | Description | Codes |
| ------ | -------- | ----------- | ----- |
| POST | `/api/auth/register` | Register a new user account | 201, 400, 409, 500 |
| POST | `/api/auth/login` | Connect to a account | 200, 401, 403, 500 |
| POST | `/api/auth/logout` | Log out a user | 200, 401, 500 |
| POST | `/api/auth/resend-validation-link` | Resend account validation link | 200, 500 |
| POST | `/api/auth/forgot-password` | Request reset password link | 200, 400, 500 |
| POST | `/api/auth/reset-password` | Change user password from reset link | 200, 400, 500 |
| GET | `/api/auth/verify` | Validate user account creation | 200, 400, 500 |
| GET | `/api/auth/validate-reset-link` | Verify password reset token | 200, 500 |
| POST | `/api/user/modify-password` | Change user password | 200, 400, 401, 500 |
| POST | `/api/user/modify-user-infos` | Change user mail / username | 200, 204, 409, 400, 401, 500 |
| POST | `/api/user/toggle-notifications` | Enable/Disable posts comments notifications | 200, 400, 401, 500 |
| POST | `/api/user/publish-image` | Post edited image | 201, 400, 401, 500 |
| POST | `/api/user/like/:image_id` | Like a post | 200, 400, 401, 500 |
| POST | `/api/user/post-comment/:image_id` | Comment a post | 201, 400, 401, 500 |
| GET | `/api/user/me` | Get user account infos | 200, 401, 500 |
| GET | `/api/user/user-gallery` | Get user's posts | 200, 401, 500 |
| GET | `/api/user/gallery-posts` | Get all users posts | 200, 400, 500 |
| GET | `/api/user/post-comment/:image_id` | Get all post comments | 201, 400, 500 |
| DELETE | `/api/user/delete-image/:image_id` | Delete post from db | 200, 400, 401, 500 |






## 🚀 Installation

### Required
- Docker and Docker Compose
- Git

### Steps

1. Clone repo
   ```bash
   git clone https://github.com/ScreakyG/camagru
   cd camagru
   ```

2. Create a `.env` file in ./back folder
   ```
   # Ports
   NGINX_PORT= 8080
   FASTIFY_PORT= 3000

   # Email Config
   EMAIL_HOST=<smtp.ethereal.email>
   EMAIL_PORT=<SERVICE PORT>
   EMAIL_USER=<your_email@gmail.com>
   EMAIL_PASS=*****

   # Security
   JWT_SECRET=******

   # App Config
   MAX_IMG_SIZE=2 # Override max image size for uploads server-side (in MB).
   
   ```
   _Values between <> and **** should be replaced by yours_

2. Launch the app
   ```bash
   ./build_script.sh
   ```

3. Access the app at http://localhost:8080

### Stop the app
Ctrl-C where you launched the script

