# FocusFlow 🎯

A modern productivity and focus management web application built with Next.js, TypeScript, and Tailwind CSS — developed as a Web Technology course project.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

FocusFlow is a productivity web application designed to help users manage their focus sessions and tasks efficiently. Built as part of a Web Technology project, it leverages modern React patterns, client-side storage, and smooth animations to deliver a seamless user experience.

Key highlights:
- **Offline-first** — uses Dexie (IndexedDB wrapper) for local data persistence
- **Smooth animations** — powered by Framer Motion
- **State management** — global state via Zustand
- **Theme support** — light/dark mode with `next-themes`
- **Type-safe** — written entirely in TypeScript

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Data Fetching | [TanStack React Query](https://tanstack.com/query) |
| Local Database | [Dexie.js](https://dexie.org/) (IndexedDB) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| ID Generation | [nanoid](https://github.com/ai/nanoid) |

---

## Project Structure

```
FocusFlow_WebtechnologyProject/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components
├── docs/             # Project documentation
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and shared logic
├── store/            # Zustand global state stores
├── next.config.js    # Next.js configuration
├── tailwind.config.js# Tailwind CSS configuration
├── postcss.config.js # PostCSS configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project metadata and dependencies
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/the-roooster/FocusFlow_WebtechnologyProject.git
cd FocusFlow_WebtechnologyProject
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

### Running the App

**Development server:**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

**Production build:**

```bash
npm run build
npm run start
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |

---

## Dependencies

### Runtime

| Package | Version | Purpose |
|---|---|---|
| `next` | ^14.2.29 | React framework with App Router |
| `react` / `react-dom` | ^18 | Core React library |
| `tailwindcss` | ^3.4.1 | Utility-first CSS framework |
| `zustand` | ^4.5.2 | Lightweight global state management |
| `@tanstack/react-query` | ^5.37.1 | Async data fetching and caching |
| `dexie` | ^3.2.7 | IndexedDB wrapper for local storage |
| `dexie-react-hooks` | ^1.1.7 | React hooks for Dexie |
| `framer-motion` | ^11.2.10 | Animation library |
| `lucide-react` | ^0.378.0 | Icon library |
| `next-themes` | ^0.4.6 | Dark/light mode theming |
| `nanoid` | ^5.1.9 | Unique ID generation |
| `autoprefixer` | ^10.5.0 | CSS autoprefixing |

### Development

| Package | Version | Purpose |
|---|---|---|
| `eslint` | ^8 | Code linting |
| `eslint-config-next` | 14.2.29 | Next.js ESLint rules |
| `postcss` | ^8 | CSS processing |
| `@types/node` / `react` / `react-dom` | ^20 / ^18 / ^18 | TypeScript type definitions |

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your message"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code passes linting (`npm run lint`) before submitting.

---

## License

This project is for educational purposes as part of a Web Technology course. All rights reserved by the contributors.

---

> Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.<div align="center">

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-FF6B35?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)

<br/>

> **🚀 Stay in the zone. Ship great work. Every single day.**

<br/>

</div>

---

## ✨ What is FocusFlow?

<div align="center">

```
╔══════════════════════════════════════════════════════╗
║   🧠  Think Better  ·  ⚡ Work Faster  ·  🎯 Do More  ║
╚══════════════════════════════════════════════════════╝
```

</div>

**FocusFlow** is a sleek, modern productivity web app that helps you take control of your focus sessions and tasks — so you can do your best work, consistently. Built as a **Web Technology course project**, it combines cutting-edge frontend tooling with an offline-first architecture for a truly seamless experience.

<br/>

## 🌟 Why FocusFlow?

<table>
<tr>
<td width="50%">

### 🔋 Offline-First
Your data lives with you — powered by **Dexie.js** (IndexedDB), FocusFlow works even without an internet connection.

</td>
<td width="50%">

### 🎬 Buttery Animations
Every interaction feels alive, thanks to **Framer Motion** bringing smooth, delightful motion to the UI.

</td>
</tr>
<tr>
<td width="50%">

### 🌗 Dark & Light Mode
Switch between themes effortlessly using **next-themes** — because your eyes deserve the best.

</td>
<td width="50%">

### 🔒 Fully Type-Safe
Written 100% in **TypeScript** — zero runtime surprises, maximum developer confidence.

</td>
</tr>
<tr>
<td width="50%">

### ⚡ Blazing Fast
Built on **Next.js 14** App Router with optimized rendering for near-instant page loads.

</td>
<td width="50%">

### 🗂️ Smart State
Global state handled by **Zustand** — lightweight, unopinionated, and blazing fast.

</td>
</tr>
</table>

<br/>

---

## 🛠️ Tech Stack

<div align="center">

| 🏷️ Layer | 🔧 Tool | 💡 Why |
|:---:|:---:|:---|
| ⚛️ **Framework** | [Next.js 14](https://nextjs.org/) | App Router, SSR, routing — all batteries included |
| 🔵 **Language** | [TypeScript](https://www.typescriptlang.org/) | Type safety & developer productivity |
| 🎨 **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first, pixel-perfect design |
| 🐻 **State** | [Zustand](https://zustand-demo.pmnd.rs/) | Minimal, fast global state |
| 🔄 **Data Fetching** | [TanStack Query](https://tanstack.com/query) | Smart caching & async state |
| 🗄️ **Local DB** | [Dexie.js](https://dexie.org/) | IndexedDB, supercharged |
| 🎞️ **Animation** | [Framer Motion](https://www.framer.com/motion/) | Production-grade animations |
| 🖼️ **Icons** | [Lucide React](https://lucide.dev/) | Beautiful, consistent iconography |
| 🌗 **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) | Effortless dark/light mode |
| 🔑 **IDs** | [nanoid](https://github.com/ai/nanoid) | Tiny, URL-safe unique IDs |

</div>

<br/>

---

## 🗂️ Project Structure

```bash
📦 FocusFlow_WebtechnologyProject
 ┣ 📂 app          →  🗺️  Next.js App Router — pages & layouts
 ┣ 📂 components   →  🧩  Reusable UI building blocks
 ┣ 📂 docs         →  📖  Project documentation
 ┣ 📂 hooks        →  🪝  Custom React hooks
 ┣ 📂 lib          →  🔧  Utility functions & shared logic
 ┣ 📂 store        →  🐻  Zustand global state stores
 ┣ 📄 next.config.js       →  ⚙️  Next.js config
 ┣ 📄 tailwind.config.js   →  🎨  Tailwind config
 ┣ 📄 tsconfig.json        →  🔵  TypeScript config
 ┗ 📄 package.json         →  📋  Dependencies & scripts
```

<br/>

---

## 🚀 Getting Started

### 🧰 Prerequisites

Make sure you have these ready:

- ![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
- ![npm](https://img.shields.io/badge/npm-latest-CB3837?style=flat-square&logo=npm&logoColor=white) or ![yarn](https://img.shields.io/badge/yarn-latest-2C8EBB?style=flat-square&logo=yarn&logoColor=white)

<br/>

### ⬇️ Installation

**Step 1 — Clone the repo:**

```bash
git clone https://github.com/the-roooster/FocusFlow_WebtechnologyProject.git
cd FocusFlow_WebtechnologyProject
```

**Step 2 — Install dependencies:**

```bash
npm install
# or, if you prefer yarn
yarn install
```

**Step 3 — Fire it up! 🔥**

```bash
npm run dev
```

🌐 Open [**http://localhost:3000**](http://localhost:3000) and start flowing!

<br/>

### 🏗️ Production Build

```bash
npm run build   # 📦 Bundle for production
npm run start   # 🚀 Launch production server
```

<br/>

---

## 📜 Available Scripts

<div align="center">

| 🎮 Command | 💬 What it Does |
|:---:|:---|
| `npm run dev` | 🔥 Spin up the hot-reload dev server |
| `npm run build` | 📦 Compile & optimize for production |
| `npm run start` | 🚀 Serve the production build |
| `npm run lint` | 🧹 Lint & catch code issues early |

</div>

<br/>

---

## 📦 Dependencies

### 🟢 Runtime

<div align="center">

| Package | Version | Role |
|:---|:---:|:---|
| `next` | `^14.2.29` | ⚛️ React meta-framework |
| `react` + `react-dom` | `^18` | 🧱 Core UI library |
| `tailwindcss` | `^3.4.1` | 🎨 Utility-first styling |
| `zustand` | `^4.5.2` | 🐻 Global state management |
| `@tanstack/react-query` | `^5.37.1` | 🔄 Async data & caching |
| `dexie` | `^3.2.7` | 🗄️ IndexedDB ORM |
| `dexie-react-hooks` | `^1.1.7` | 🪝 React hooks for Dexie |
| `framer-motion` | `^11.2.10` | 🎞️ Animations & gestures |
| `lucide-react` | `^0.378.0` | 🖼️ Icon library |
| `next-themes` | `^0.4.6` | 🌗 Dark/light theming |
| `nanoid` | `^5.1.9` | 🔑 Unique ID generation |
| `autoprefixer` | `^10.5.0` | 🔧 CSS vendor prefixes |

</div>

### 🔵 Development

<div align="center">

| Package | Version | Role |
|:---|:---:|:---|
| `typescript` | `^5` | 🔵 Type checking |
| `eslint` | `^8` | 🧹 Code linting |
| `eslint-config-next` | `14.2.29` | ✅ Next.js lint rules |
| `postcss` | `^8` | 🎨 CSS transformation |
| `@types/*` | `^18–20` | 📘 TypeScript definitions |

</div>

<br/>

---

## 🤝 Contributing

We love contributions! Here's how to jump in:

```
1. 🍴  Fork this repo
2. 🌿  Create your branch   →  git checkout -b feature/amazing-thing
3. ✍️   Commit your changes  →  git commit -m "✨ Add amazing thing"
4. 📤  Push to your branch  →  git push origin feature/amazing-thing
5. 🔀  Open a Pull Request  →  and let's review together!
```

> ⚠️ Make sure `npm run lint` passes before opening a PR!

<br/>

---

## 📄 License

This project is built for **educational purposes** as part of a Web Technology course.
All rights reserved by the contributors.

<br/>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=twinkling" width="100%"/>

**Made with 🔥 passion, ☕ coffee, and lots of `npm run dev`**

[![GitHub](https://img.shields.io/badge/View_on_GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/the-roooster/FocusFlow_WebtechnologyProject)

*Stay focused. Stay in flow.* 🎯

</div>
