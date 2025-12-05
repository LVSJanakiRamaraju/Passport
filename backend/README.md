# Passport Application Backend

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Setup PostgreSQL Database

**Option A: Using Supabase**
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **SQL Editor** and run the contents of `setup_database.sql`
4. Go to **Settings** > **Database** to get your connection string
5. Copy the **Connection String** (URI format)

**Option B: Using Local PostgreSQL**
1. Install PostgreSQL on your machine
2. Create a new database
3. Run the SQL from `setup_database.sql`

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` and add your database URL:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

Example for Supabase:
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Example for local PostgreSQL:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/passport_db
```

### 4. Run the Server
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Database Tables

### users
- id (Primary Key)
- username (Unique)
- email
- password
- category (Applicant or Passport Administrator)
- created_at

### applications
- id (Primary Key)
- username
- full_name
- email
- phone
- address
- status (pending/accepted/rejected)
- created_at
