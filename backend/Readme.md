🏗️ System Architecture

This project follows a modular REST API architecture built on Node.js + Express.js, structured around a scalable MVC (Model–View–Controller) pattern with MongoDB as the database.

The system is designed as a hybrid social media platform, combining:

Twitter-like text posting system
YouTube-like video streaming system
🧠 Architecture Overview

The backend is divided into multiple layers:

Routes Layer → API endpoint handling
Controller Layer → Business logic execution
Model Layer (MongoDB) → Schema definitions & relationships
Middleware Layer → JWT auth, file upload handling, validation
Service Layer → External integrations (Cloudinary, etc.)
🧩 Database Design (ER Model)

The system consists of the following core entities:

Users
Videos
Tweets
Comments
Likes
Playlists
Subscriptions

These entities are interconnected to support:

Social interactions (likes, comments, subscriptions)
Content creation (tweets & videos)
Media organization (playlists)
📊 ER Diagram / Data Model

👉 View full model here:
https://app.eraser.io/workspace/NE8MdfjddSun6txbUxfY

🔗 Relationship Flow
A User can upload videos, post tweets, like content, comment, and subscribe to other users
A Video can have likes, comments, and belong to playlists
A Tweet can have likes and comments
Comments & Likes can be associated with both tweets and videos
Subscriptions manage follower–following relationships
⚙️ High-Level System Flow
Client
  ↓
Express.js API Server
  ↓
Controllers (Business Logic)
  ↓
MongoDB Database
  ↓
Cloudinary (Media Storage)
🔐 Authentication Flow
User registers or logs in
Server generates JWT token
Token is stored on client side
Middleware verifies token for protected routes
☁️ Media Upload Flow
File uploaded via Multer
Temporary processing on server
Uploaded to Cloudinary
URL stored in MongoDB
Delivered via CDN
🚀 Key Highlights
Modular MVC architecture
Scalable social media system design
Hybrid platform (Twitter + YouTube features)
Secure authentication with JWT
Cloud-based media storage
Clean relational modeling using MongoDB
