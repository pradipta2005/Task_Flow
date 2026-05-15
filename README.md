

  # TaskFlow

  **Premium Team Task Management & Executive Dashboard**

  [![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

  [View Live Demo](https://task-flow-two-khaki.vercel.app/) •
  [Report Bug](https://github.com/pradipta2005/task_flow/issues) •
  [Request Feature](https://github.com/pradipta2005/task_flow/issues)
</div>

---

## 📌 Overview

**TaskFlow** is a modern, dark-themed command center for execution-focused teams. It blends high-end aesthetics with powerful functionality, offering real-time Kanban boards, role-based analytics, and seamless task assignment in an obsidian-styled, glassmorphism interface. 

Built with the latest **Next.js App Router**, **Server Actions**, and **Supabase**, TaskFlow guarantees enterprise-grade security and optimistic UI updates that keep your team moving forward instantly.

---

## 🚀 Live Application

Experience the premium interface and performance firsthand:

🔗 **[https://task-flow-two-khaki.vercel.app/](https://task-flow-two-khaki.vercel.app/)**

---

## ✨ Core Features

* **Real-time Kanban Workflow:** Click-to-advance cards that flow smoothly from *Todo* → *In Progress* → *Done*.
* **Enterprise Role-Based Access Control (RBAC):** Strict data isolation. **Admins** manage the entire team, while **Members** see only their assigned workload.
* **Optimistic UI Updates:** Instant visual feedback powered by React `useOptimistic` hooks and Next.js Server Actions. Changes reflect instantly before the database confirms.
* **Live Analytics & Executive Dashboard:** Real-time KPI tracking including completion rates, workload heatmaps, and overdue tasks tracking.
* **Team Command Center:** Easily assign members to projects, monitor individual throughput, and oversee organizational health.
* **High-Fidelity Aesthetics:** Built with `framer-motion` for fluid micro-interactions, custom scrollbars, and premium glassmorphic UI cards.

---

## 🛠 Tech Stack

**Frontend:**
- [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Lucide React](https://lucide.dev/) (Icons)

**Backend & Database:**
- [Supabase](https://supabase.com/) (PostgreSQL Database)
- [Prisma](https://www.prisma.io/) (Typescript ORM)
- Next.js Route Handlers (API Layer)
- JWT (Custom Authentication)

---

## ⚙️ Getting Started

Follow these steps to run TaskFlow locally.

### 1. Clone the repository
```bash
git clone https://github.com/pradipta2005/task_flow.git
cd task_flow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables. *Note: `.env` is intentionally ignored by git.*
```env
# Supabase PostgreSQL Connection String
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# JWT Secret for Authentication
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. Database Setup
Push the Prisma schema to your Supabase PostgreSQL database:
```bash
npx prisma db push
# or to run migrations:
npx prisma migrate dev
```
Generate the Prisma Client:
```bash
npx prisma generate
```

### 5. Run the development server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗️ Project Structure

```text
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router (Pages & API routes)
│   │   ├── actions/      # Next.js Server Actions
│   │   ├── api/          # RESTful API endpoints
│   │   └── dashboard/    # Protected application views
│   ├── components/       # Reusable UI components
│   └── lib/              # Utilities (Prisma Client, Auth logic)
```

---

## 🛡️ Security

TaskFlow ensures data integrity by verifying JWT tokens on every restricted API request and Server Action. Member roles cannot modify tasks unassigned to them or access team-wide statistics, guaranteeing full organizational data privacy.

---

## 📄 License

This project is licensed under the MIT License.

---
<div align="center">
  <p>Built with precision and high-end design principles.</p>
</div>
