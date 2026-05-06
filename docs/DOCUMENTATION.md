# FocusFlow — Beginner's Documentation Guide

Welcome to **FocusFlow**! This document is designed to help anyone—especially beginners—understand what this project is, what technologies it uses, how the code is structured, and how to run it locally on your machine.

---

## 1. What is FocusFlow?
FocusFlow is a "gentle" productivity application. Unlike traditional productivity apps that use stressful red badges and "streaks" to keep you engaged, FocusFlow is designed for well-being. It focuses on deep work, guilt-free habit tracking, intuitive notes, and mindful analytics. It even includes a "Recovery Mode" for days when you just need to rest.

---

## 2. Tech Stack (What powers the app?)
FocusFlow is built using modern, industry-standard web technologies:
* **Framework**: **Next.js 14** (using the modern App Router) and **React 18**.
* **Styling**: **Tailwind CSS**. It uses custom "semantic" variables so the app can flawlessly switch between Light and Dark mode.
* **Animations**: **Framer Motion**. Used for fluid, premium animations (like the Apple-style wave animation on the side dock, and 3D modal pop-ins).
* **State Management**: **Zustand**. A lightweight library that remembers the user's current state (e.g., whether the sidebar is collapsed, or if a timer is running).
* **Database**: **Dexie.js (IndexedDB)**. FocusFlow works completely *offline*. All user data (habits, logs, tasks) is saved directly in the browser's local database.
* **Icons**: **Lucide React**.

---

## 3. How to Run the Project Locally
If you want to run FocusFlow on your own computer, follow these simple steps:

### Prerequisites:
1. You must have **Node.js** installed on your computer. You can download it from [nodejs.org](https://nodejs.org/).
2. A code editor like **Visual Studio Code (VS Code)**.

### Steps to Start:
1. **Open your terminal** (or command prompt) and navigate to the `focusflow` folder.
2. **Install dependencies**: Run the following command to download all the necessary packages (like Next.js, Framer Motion, etc.):
   ```bash
   npm install
   ```
3. **Start the development server**: Once the installation is complete, run:
   ```bash
   npm run dev
   ```
4. **Open in Browser**: Open your web browser (Chrome, Edge, Safari, etc.) and go to `http://localhost:3000`. You should now see FocusFlow running!

---

## 4. Project Structure (Where is everything?)
For a beginner, a large codebase can be intimidating. Here is a breakdown of the folders and where to find things:

* `app/` 
  * This is the core routing folder for Next.js. Every folder inside here represents a URL page. For example, `app/habits/page.tsx` represents the `/habits` webpage.
  * Contains `layout.tsx` (the main wrapper of the app) and `globals.css` (global styles and Dark Mode colors).
* `components/`
  * Contains reusable React components. It is neatly organized by feature:
    * `components/shell/`: The main layout wrappers, `AppShell`, `TopBar`, and the `Sidebar` (which features the Apple-style dock animation).
    * `components/dashboard/`: Dashboard widgets like the `ConversationalReset` and `QuietInsights`.
    * `components/habits/`: Habit-specific UI like the `AddHabitModal`, `HabitCard`, and `HabitHeatmap`.
    * `components/deep-work/`: The `FocusTimer` and `NoiseSelector`.
    * `components/notes/`: Components for the block-based notes system.
* `store/`
  * Contains **Zustand** stores. These files manage global data. For example, `deepWorkStore.ts` keeps track of the timer even if you navigate to another page.
* `lib/`
  * Helper functions and core logic. `db.ts` defines the offline IndexedDB database using Dexie. `analytics.ts` contains the math used to generate your Focus Patterns.
* `hooks/`
  * Custom React Hooks. For example, `useTimer.ts` handles the countdown logic and saves sessions when you close the browser window.

---

## 5. Key Features & How They Work

### A. The Dock (Sidebar)
Located in `components/shell/Sidebar.tsx`. It acts as the main navigation. It uses Framer Motion (`motion.a`) and math calculations based on your mouse hover to create a satisfying, wave-like magnification effect similar to macOS. 

### B. Deep Work Timer
Located in `components/deep-work/FocusTimer.tsx`. It allows you to set a focus timer and listen to ambient noises (Rain, Forest, Cafe). 
* **Fun Fact:** If you accidentally close your browser window while a timer is running, a `beforeunload` event automatically catches it and saves the exact amount of time you worked to the database!

### C. Habits & Analytics
Habits are stored offline. When you click to complete a habit, it updates `db.habits` in your browser. The Analytics page (`app/analytics/AnalyticsContent.tsx`) then reads this database to generate a "Habit Radar" and "Focus Pattern" graph.

### D. Recovery Mode
A core philosophy of FocusFlow. Toggled via the Top Bar, it mutes the UI, hides analytics entirely, and shifts the app into a pastel, calm color scheme to help users take a guilt-free break.

---

## 6. Beginner's Tip for Making Changes
If you want to play around with the code, here is the safest way to start:
1. **Change Colors:** Open `app/globals.css`. Try changing the hex codes under `--brand-blue` or `--bg-base`. Save the file, and watch the app update instantly in your browser!
2. **Change Animations:** Open `components/shell/Sidebar.tsx`. Look for the `scale = isHovered ? 1.35 ...` line. Try changing `1.35` to `2.0` and see what happens when you hover over the dock!
3. **Use the Console:** If something breaks, right-click your browser, click **Inspect**, and go to the **Console** tab. It will usually tell you exactly what went wrong.

Enjoy building and exploring FocusFlow!
