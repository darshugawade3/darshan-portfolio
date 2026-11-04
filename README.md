# 🚀 Darshan Suresh Gawade — Portfolio & Admin CMS

A **premium full-stack portfolio web application** built with Next.js 15, TypeScript, Tailwind CSS, and Firebase.  
Everything is editable from a secure Admin Dashboard — no coding required for updates.

---

## ✨ Features

| Feature | Detail |
|---------|--------|
| **Admin Dashboard** | Full CMS — edit everything from one panel |
| **Firebase Backend** | Firestore database + Storage + Auth |
| **Real-time Updates** | Profile changes appear instantly on site |
| **Visitor Counter** | Tracks unique session visitors |
| **File Uploads** | PDF, PPT, DOCX, Images — all via drag & drop |
| **Contact Form** | Messages stored in Firestore, viewable in Admin |
| **Particle Animation** | Interactive canvas background |
| **Typing Effect** | Animated role titles in hero section |
| **Skill Bars** | Animated, fully editable from Admin |
| **Gallery** | Albums, drag-drop upload, lightbox preview |
| **Research Library** | Upload PDFs, PPTs, research papers |
| **SEO Ready** | Meta tags, OpenGraph, sitemap-ready |
| **Responsive** | Mobile, tablet, desktop |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx         ← Admin login
│   │   ├── layout.tsx             ← Admin layout with sidebar
│   │   ├── dashboard/page.tsx     ← Analytics dashboard
│   │   ├── profile/page.tsx       ← Edit profile, photo, bio
│   │   ├── education/page.tsx     ← Add/edit education
│   │   ├── skills/page.tsx        ← Manage skills & levels
│   │   ├── projects/page.tsx      ← Full project management
│   │   ├── certificates/page.tsx  ← Certificate management
│   │   ├── gallery/page.tsx       ← Photo gallery + albums
│   │   ├── research/page.tsx      ← Research portfolio
│   │   ├── resume/page.tsx        ← Upload/replace resume
│   │   └── messages/page.tsx      ← View contact messages
│   ├── page.tsx                   ← Public portfolio home
│   ├── layout.tsx                 ← Root layout + providers
│   └── globals.css                ← Design system + variables
├── components/portfolio/          ← All public-facing sections
├── lib/
│   ├── firebase.ts                ← Firebase initialization
│   ├── db.ts                      ← All Firestore CRUD operations
│   ├── storage.ts                 ← Firebase Storage helpers
│   └── auth-context.tsx           ← Authentication context
├── hooks/usePortfolioData.ts      ← Data fetching hooks
└── types/index.ts                 ← TypeScript interfaces
```

---

## ⚡ Setup Guide (Step by Step)

### Step 1 — Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → Name it `darshan-portfolio`
3. Enable **Google Analytics** (optional but recommended)
4. Click **"Create Project"**

### Step 2 — Enable Firebase Services

**Firestore Database:**
1. Sidebar → **Firestore Database** → **Create database**
2. Choose **Production mode** → Select region: `asia-south1` (Mumbai)
3. Click **Enable**

**Firebase Storage:**
1. Sidebar → **Storage** → **Get started**
2. Accept default security rules (we'll replace them)
3. Choose region: `asia-south1`

**Firebase Authentication:**
1. Sidebar → **Authentication** → **Get started**
2. Click **"Email/Password"** → Toggle **Enable** → Save
3. Click **"Add user"** tab → Add your admin email + password
   - Email: `darshhugawade3@gmail.com`
   - Set a strong password

### Step 3 — Get Firebase Config

1. Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **"</>   Web"**
3. Register app as `portfolio` → Copy the config object

### Step 4 — Configure Environment Variables

```bash
# Create .env.local in project root
cp .env.example .env.local
```

Open `.env.local` and fill in all values from your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=darshan-portfolio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=darshan-portfolio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=darshan-portfolio.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 5 — Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select your project)
firebase use darshan-portfolio

# Deploy rules
firebase deploy --only firestore:rules,storage
```

### Step 6 — Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the portfolio.  
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

### Step 7 — Seed Initial Data (Optional)

```bash
node scripts/seed-firebase.js
```

This pre-fills Darshan's data into Firestore so the portfolio shows content immediately.

---

## 🎛️ Admin Panel Guide

| URL | What you can do |
|-----|----------------|
| `/admin/login` | Sign in with your Firebase email/password |
| `/admin/dashboard` | See visitor stats, message count, charts |
| `/admin/profile` | Upload photo, edit name, bio, contact, social links |
| `/admin/education` | Add/edit/delete education history |
| `/admin/skills` | Add skills, set proficiency %, reorder |
| `/admin/projects` | Full project editor with file uploads |
| `/admin/certificates` | Add certificate images and PDFs |
| `/admin/gallery` | Create albums, drag-drop upload photos |
| `/admin/research` | Upload research papers, PPTs, posters |
| `/admin/resume` | Upload/replace your resume PDF |
| `/admin/messages` | Read contact form submissions |

---

## 🚢 Deploy to Vercel (Free)

### Method 1 — GitHub + Vercel (Recommended)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/darshan-portfolio
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. **Environment Variables** section → Add all variables from `.env.local`
5. Click **Deploy** ✅

### Method 2 — Vercel CLI

```bash
npm install -g vercel
vercel
# Follow prompts, set environment variables when asked
```

### Adding Environment Variables in Vercel

In your Vercel project:  
**Settings → Environment Variables** → Add each variable from `.env.local`

---

## 📁 Firestore Database Schema

```
Firestore
├── config/
│   └── profile         ← name, title, bio, photo, email, phone, links, counters
├── education/          ← degree, institute, university, year, grade, achievements[]
├── skills/             ← name, level (0-100), category, order
├── projects/           ← title, description, tags[], images[], pdfReport, pptFile, objectives[]
├── certificates/       ← title, organization, date, imageURL, pdfURL
├── gallery/            ← url, caption, album, uploadedAt
├── gallery_albums/     ← name, description, count
├── research/           ← title, abstract, type, authors[], fileURL, pptURL
├── achievements/       ← title, description, category, year, icon
└── messages/           ← name, email, subject, message, read, replied, createdAt
```

---

## 🗄️ Firebase Storage Structure

```
Firebase Storage
├── profile/
│   └── photo              ← Profile photo
├── resume/
│   └── resume.pdf         ← Resume file
├── projects/
│   └── {projectId}/       ← Project images, PDFs, PPTs
├── certificates/
│   └── {certId}/          ← Certificate images and PDFs
├── gallery/
│   └── {albumId}/         ← Gallery photos
└── research/
    └── {resId}/           ← Research papers, presentations
```

---

## 🔧 How to Update Content

### Change Profile Photo
1. Go to `/admin/profile`
2. Click the photo area or drag a new photo
3. Photo uploads automatically to Firebase Storage

### Add a New Project
1. Go to `/admin/projects` → Click **"Add Project"**
2. Fill in title, description, objectives, methodology, results
3. Upload images, PDF report, PPT presentation
4. Mark as **Featured** if you want it highlighted
5. Click **Save Project** — appears on portfolio instantly

### Upload New Resume
1. Go to `/admin/resume`
2. Click upload zone or drag PDF file
3. Old resume is replaced automatically

### Add Certificate
1. Go to `/admin/certificates` → Click **"Add Certificate"**
2. Fill in title, organization, date
3. Upload certificate image (JPG/PNG) and/or PDF
4. Save — appears in portfolio immediately

### Add Gallery Photo
1. Go to `/admin/gallery`
2. Create an album first (e.g. "Laboratory", "Seminars")
3. Select the album → Drag & drop photos
4. Photos upload to Firebase Storage automatically

---

## 🎨 Design Customization

All design tokens are CSS variables in `src/app/globals.css`:

```css
:root {
  --bg: #020817;          /* Main background */
  --bg2: #050f1e;         /* Secondary background */
  --cyan: #22d3ee;        /* Primary accent */
  --gold: #fbbf24;        /* Secondary accent */
  --text: #f8fafc;        /* Primary text */
  --muted: #94a3b8;       /* Muted text */
}
```

---

## 🔒 Security Notes

- Admin login is protected by Firebase Authentication
- Firestore rules prevent unauthorized writes
- Storage rules validate file types and sizes
- Never commit `.env.local` to Git
- Use strong password for admin account

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Authentication |
| Charts | Recharts |
| Toasts | react-hot-toast |
| File Upload | react-dropzone |
| Deployment | Vercel |
| Font | Exo 2 + Space Grotesk (Google Fonts) |

---

*Built for Darshan Suresh Gawade — B.Pharm Student, Pharmaceutical Researcher, Healthcare Data Analyst*  
*Powered by Firebase · Deployed on Vercel*
