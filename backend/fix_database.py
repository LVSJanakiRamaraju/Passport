import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

try:
    print("Connecting to database...")
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    
    print("Dropping old applications table...")
    cur.execute("DROP TABLE IF EXISTS applications")
    
    print("Creating new applications table with updated fields...")
    cur.execute("""
        CREATE TABLE applications (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            father_name VARCHAR(255) NOT NULL,
            date_of_birth DATE NOT NULL,
            permanent_address TEXT NOT NULL,
            temporary_address TEXT NOT NULL,
            phone VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL,
            pan VARCHAR(10) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)
    
    print("Creating indexes...")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_applications_username ON applications(username)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)")
    
    conn.commit()
    print("✓ Database migration completed successfully!")
    
    # Verify the table structure
    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'applications'
        ORDER BY ordinal_position
    """)
    
    print("\nNew table structure:")
    for row in cur.fetchall():
        print(f"  - {row[0]}: {row[1]}")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"✗ Migration failed: {e}")
    import traceback
    traceback.print_exc()
