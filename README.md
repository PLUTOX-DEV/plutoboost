# PlutoBoost – Full-Stack Social Growth Platform

This project is a complete, production-ready social media growth platform featuring a React + Tailwind UI and a Node.js + Express backend. It includes user authentication, payment integration with Paystack, service ordering via the Exo Booster API, and a full-featured admin panel.

## Features

### User-Facing
- User registration and login (including Google OAuth)
- Secure password reset functionality
- Dashboard for placing new orders for various social media services
- Wallet system with funding via Paystack
- Order history and analytics pages
- Dedicated notifications page
- Affiliate program and public-facing info pages (Blog, About, etc.)

### Admin Panel
- Comprehensive dashboard with system stats (revenue, users, orders)
- User management (view, edit, suspend, activate)
- Order and deposit management
- Notification management (send broadcast or user-specific notifications)
- System status monitoring and maintenance mode control

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Axios, Recharts
*   **Backend**: Node.js, Express, Mongoose (MongoDB), Passport.js (for auth), JWT
*   **Database**: MongoDB Atlas
*   **Hosting**: Prepared for Vercel (Frontend + Serverless Backend)

## Project Setup

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm
*   A MongoDB Atlas account

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a file named `.env` in the `backend` directory. Copy the contents from the `.env.example` file (if one exists) or use the template below and fill in your secret keys.

    ```dotenv
    # --- Application URLs ---
    FRONTEND_URL=http://localhost:5173

    # --- MongoDB Database ---
    MONGODB_URI=your_mongodb_atlas_connection_string

    # --- Security & Authentication ---
    JWT_SECRET=a_very_long_and_random_secret_string
    ADMIN_PASSWORD_HASH=your_generated_admin_password_hash
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    CRON_SECRET=another_long_and_random_secret_for_cron_jobs

    # --- Service Provider (Exo Booster) ---
    EXOBOOSTER_API_URL=https://exosupplier.com/api/v2
    EXO_API_KEY=your_exo_booster_api_key

    # --- Payments (Paystack) ---
    PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key

    # --- Email Notifications (Gmail) ---
    SMTP_USER=youremail@gmail.com
    SMTP_PASS=your_16_character_gmail_app_password
    ADMIN_EMAIL=your_admin_email@example.com
    ```

4.  **Whitelist your IP Address in MongoDB Atlas:**
    Go to your MongoDB Atlas dashboard, navigate to **Network Access**, and add your current IP address to allow your backend to connect to the database.

5.  **Run the backend server:**
    ```bash
    node index.js
    ```
    The backend should now be running on `http://localhost:5000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a file named `.env` in the `frontend` directory with the following content:

    ```dotenv
    VITE_API_BASE_URL=http://localhost:5000
    VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key
    ```

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend should now be accessible at `http://localhost:5173`.

## Deployment to Vercel

This project is pre-configured for easy deployment on Vercel.

1.  **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2.  **Import the project** into Vercel. Vercel will automatically detect the `vercel.json` file in the root directory and configure the build settings.
3.  **Add Environment Variables** in the Vercel project settings. Add all the variables from your `backend/.env` file.
4.  **Create a `frontend/.env` file** with the following settings:

    ```dotenv
    VITE_API_BASE_URL=https://your-vercel-app.vercel.app
    VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key
    ```

5.  **Deploy!** Vercel will build both the frontend and backend and deploy them. The cron jobs defined in `vercel.json` will be automatically scheduled.

## Git Ignore Recommendations

Use these ignore rules in your repository root and `backend/.gitignore`:

- `node_modules/` directories
- `frontend/dist/`
- environment files like `.env` and `.env.*`
- editor and system files such as `.DS_Store`, `.vscode/`, `npm-debug.log*`, and `yarn-error.log*`

The root `.gitignore` included with this project already covers these patterns.
