# LaveDocs – Collaborative Document Editor

A lightweight, AI-assisted full-stack collaborative document editor inspired by Google Docs.
Built with **Next.js 14, Prisma, SQLite, and TipTap**, this project demonstrates clean product thinking, full-stack implementation, and practical engineering decisions under time constraints.

---

## 🚀 Features

### 📝 Document Management

* Create, rename, and delete documents
* Persistent storage using Prisma + SQLite
* Automatic save and reload functionality

### ✍️ Rich Text Editing

* Built with TipTap editor
* Supports:

  * Bold, Italic, Underline
  * Headings
  * Lists
* Clean, distraction-free editing UI

### 🤝 Collaboration (Simulated)

* Share documents via email (mocked users)
* "My Documents" vs "Shared With Me" views
* User switching to simulate multi-user system

### 📎 File Upload

* Upload `.txt` files
* Attach files to documents
* View attachments in sidebar

### 🎨 UI/UX

* Modern SaaS-style interface
* Responsive design
* Clean layout with clear document hierarchy

---

## 🛠️ Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling  | TailwindCSS                         |
| Editor   | TipTap                              |
| Backend  | Next.js API Routes                  |
| Database | Prisma + SQLite                     |
| State    | React Hooks                         |

---

## 📂 Project Structure

```
app/                # Next.js App Router pages
components/         # UI and feature components
lib/                # API utilities and types
prisma/             # Database schema and SQLite DB
public/uploads/     # Uploaded files
```

---

## ⚙️ Getting Started

### 1. Install dependencies

```
npm install
```

### 2. Setup database

```
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Run the app

```
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 🧪 Test Flow

1. Create a document as:

```
lave@owner.com
```

2. Add collaborator:

```
inareshofficial@gmail.com
```

3. Switch user → view "Shared With Me"

4. Edit document and verify persistence

---

## 🧠 Architecture Overview

* Monolithic full-stack app using Next.js
* API routes handle backend logic
* Prisma ORM manages SQLite database
* Frontend filters simulate multi-user collaboration
* No authentication system (intentionally scoped)

---

## 🤖 AI Usage

AI tools were used to:

* Scaffold components and API routes
* Generate initial structures
* Assist debugging and refinement

All logic was reviewed, corrected, and tested manually.

---

## ⚖️ Tradeoffs & Decisions

| Decision                   | Reason                               |
| -------------------------- | ------------------------------------ |
| No authentication          | Kept scope manageable                |
| SQLite                     | Simple setup, no external dependency |
| No real-time collaboration | Focused on core functionality        |
| Mock users                 | Simulates real sharing behavior      |

---

## 📌 What’s Complete

* Document creation/editing
* Sharing logic
* File upload
* Persistent storage
* Clean UI/UX

---

## 🔧 What Could Be Improved

* Real authentication system
* Real-time collaboration (WebSockets)
* Document version history
* Role-based permissions

---

## 📹 Demo

(Include your video link here)

---

## 📎 Submission Notes

This project focuses on:

* Clean architecture
* Practical product thinking
* Functional full-stack implementation
* Clear prioritization under time constraints

---

## 👨‍💻 Author

**Naresh Singam**

---

## ⭐ Final Note

This project is intentionally scoped to demonstrate strong fundamentals rather than over-engineering features.

---
