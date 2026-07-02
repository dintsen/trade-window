# Supabase Setup Guide

Trade Window uses Postgres for long-term production storage of OTC Board Listings and Deal Requests. Supabase provides an easy way to provision a Postgres instance without the overhead of manually managing the database server.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in.
2. Click **New Project** and select your organization.
3. Enter a project name (e.g., `trade-window`) and set a strong database password.
4. Choose the region closest to where your Go backend will be deployed.
5. Click **Create new project**.

## 2. Run Database Migrations

1. Once your project is provisioned, navigate to the **SQL Editor** in the left sidebar.
2. Open the file `services/backend-go/migrations/001_create_board_and_requests.sql` from your local project repository.
3. Copy the entire contents of the file and paste it into the Supabase SQL Editor.
4. Click **Run**.
5. You should see a success message indicating that the `board_listings` and `deal_requests` tables, along with their indexes, have been created.

## 3. Retrieve Postgres Connection String

1. In the Supabase dashboard, go to **Project Settings** (gear icon) > **Database**.
2. Scroll down to the **Connection string** section.
3. Select **URI** mode.
4. Copy the connection string. It will look something like this:
   `postgres://postgres.yourprojectid:yourpassword@aws-0-region.pooler.supabase.com:6543/postgres`
5. Replace `[YOUR-PASSWORD]` with the database password you created in step 1.

## 4. Configure the Go Backend

The Go backend supports a modular storage driver system. By default, it runs with local `.jsonl` files (`STORAGE_DRIVER=jsonl`). 

To switch to Postgres, set the following environment variables on your backend hosting provider (e.g., Render, Railway, Fly.io, or your VPS):

```ini
STORAGE_DRIVER=postgres
DATABASE_URL=postgres://postgres.yourprojectid:yourpassword@aws-0-region.pooler.supabase.com:6543/postgres
```

**Security Warning:** Do NOT commit your `DATABASE_URL` to Git and do NOT expose it to the Next.js frontend via a `NEXT_PUBLIC_` variable.

## 5. Configure the Frontend

The frontend remains completely oblivious to Supabase. It only talks to your Go backend. Make sure your Vercel (or other frontend hosting) environment is configured to point to the Go backend's URL:

```ini
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL
NEXT_PUBLIC_WS_URL=wss://YOUR_BACKEND_URL/ws
```

## Privacy & Security Considerations

- **Private Information:** Information such as user emails and names are stored securely in the `board_listings` and `deal_requests` tables in Postgres. 
- **API Boundaries:** The Go backend explicitly strips this private information (using the `ToPublic()` DTO mapper) before sending it over the network to the frontend.
- **Direct Access:** Do not give end users direct access to the Supabase database. All interactions must go through the Go backend API to enforce these privacy boundaries.
