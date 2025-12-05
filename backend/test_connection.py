import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

try:
    print("Attempting to connect to database...")
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    print("✓ Database connection successful!")
    
    cur = conn.cursor()
    
    # Check if tables exist
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    tables = cur.fetchall()
    
    if tables:
        print("\n✓ Found tables:")
        for table in tables:
            print(f"  - {table[0]}")
    else:
        print("\n⚠ No tables found. Please run setup_database.sql in Supabase SQL Editor")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"✗ Database connection failed!")
    print(f"Error: {e}")
