# Development Guide

This guide covers how to set up the development environment, run the application, and work with the various tools used in this project.

## Prerequisites

- **Git**: Ensure you have Git installed (latest version recommended).
- **Node.js**: Ensure you have Node.js installed (latest version recommended).

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/rossprokopchenko/hack4change-site.git
    cd hack4change-site
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Environment Setup

1.  Create a Supabase project on [Supabase](https://supabase.com/).
    -  Go to the SQL Editor in your Supabase dashboard.
    -  Run the contents of `supabase-schema.sql` to set up the database schema, tables, and security policies.
    -  Get your Supabase API keys from Project Settings > API for your `.env.local` file.

2.  Copy the example environment file:
    ```bash
    cp example.env.local .env.local
    ```

3.  Open `.env.local` and configure the following variables:

    -   **Supabase Configuration**:
        -   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
        -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anonymous key.
        -   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (required for some server-side operations and tests).

    -   **Google Auth** (Optional for local dev if not testing OAuth):
        -   `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth Client ID.

    -   **Other Defaults**:
        -   `NEXT_PUBLIC_API_URL`: Defaults to `http://localhost:3001/api`.
        -   `NEXT_PUBLIC_IS_SIGN_UP_ENABLED`: Set to `true` to enable sign-ups.
        -   `NEXT_PUBLIC_FILE_DRIVER`: Defaults to `local`.

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Testing and Linting

-   **Linting**: Run ESLint to check for code quality issues.
    ```bash
    npm run lint
    # or to fix issues automatically
    npm run lint:fix
    ```

-   **End-to-End Tests**: We use Playwright for E2E testing.
    ```bash
    # Install Playwright browsers first
    npx playwright install

    # Run tests
    npx playwright test
    ```

## Storybook

We use Storybook for UI component development and documentation.

To start Storybook:
```bash
npm run sb
```
Storybook will be available at `http://localhost:6006`.

## Code Generation

We use [Hygen](https://www.hygen.io/) for generating code templates.

-   **Generate a new Resource** (CRUD):
    ```bash
    npm run generate:resource
    ```

-   **Generate a new Field**:
    ```bash
    npm run generate:field
    ```
