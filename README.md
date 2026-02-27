# Harshit Paints E-Commerce

A full-stack e-commerce web application for Harshit Paints built with Next.js, Express, Prisma, and PostgreSQL.

## Project Structure

This repository is organized as a monorepo containing both the frontend and backend applications.

- `/frontend`: Next.js (React) application for the customer and admin interfaces.
- `/backend`: Node.js/Express application serving the RESTful API and handling database interactions via Prisma.

## Tech Stack

**Frontend:**
- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

**Backend:**
- Node.js
- Express
- PostgreSQL (Database)
- Prisma (ORM)
- JSON Web Tokens (JWT) for Authentication
- PDFKit for Invoice Generation
- Nodemailer for Emails

## Getting Started

To run the full stack locally, you can use the provided `run.bat` script at the root of the project, which will start both the backend and frontend development servers concurrently:

```bash
run.bat
```

Alternatively, you can run them individually:

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (.env file required).
4. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

The application will be accessible at `http://localhost:3000` and the API at `http://localhost:5000`.
