# Todolist

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, follow these steps to set up the environment and run the application:

1. Copy the example environment file:
   ```bash
   cp .env-example .env
   ```
   Adjust the variables inside `.env` as needed.

2. Install dependencies using pnpm:
   ```bash
   pnpm i
   ```

3. If using Prisma, make sure to set up the database before running Docker Compose.

4. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```