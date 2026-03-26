# Projexis - Project Management App (Frontend)

Projexis is a comprehensive project management web application built with React and Vite. It provides teams with a centralized platform to manage projects, tasks, team members, and analytics.

## Features

- **User Authentication**: Secure Login, Registration, Password Recovery, and an Invite System.
- **Dashboard**: High-level overview of project statuses and upcoming deadlines.
- **Project Management**: Create, update, view, and organize projects and their respective tasks.
- **Team Collaboration**: Manage team roles, invite members, and view member profiles.
- **Calendar View**: A visual timeline for task deadlines and project milestones.
- **Analytics**: Data visualizations for project progress and team productivity.
- **Settings & Profile**: Customizable user profiles and application settings.

## Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4, PostCSS
- **Icons**: Lucide React
- **Date Utility**: date-fns
- **Linting & Code Quality**: ESLint

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (if required). 
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to find and fix problems.
- `npm run preview`: Previews the production build locally.

## Project Structure

- `src/pages/`: Contains all route components (Dashboard, Projects, Login, etc.).
- `src/context/`: React Context for global state management (e.g., authentication).
- `src/components/`: Reusable UI components.
