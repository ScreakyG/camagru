# Camagru

<div align="center">
  <img src="./instagram_old_logo.png" alt="Camagru Logo" width="200">
  <p>A light social media app</p>
</div>

## Description

Camagru is a instagram like web app that allow users to take live pictures with their webcam, tweak them then post them.
</br>
⚠️ This project is at early stages, im working on image edition.


## TODO:
- Parse the comments for security.

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
- Set notifications ❌

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
   MAX_IMG_SIZE=2 # Max image size for uploads (in MB).
   
   ```
   _Values between <> and **** should be replaced by yours_

2. Launch the app
   ```bash
   ./build_script.sh
   ```

3. Access the app at http://localhost:8080

### Stop the app
Ctrl-C where you launched the script

