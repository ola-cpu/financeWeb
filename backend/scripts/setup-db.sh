#!/bin/bash

# Configuration
DB_NAME="babylon_db"
DB_USER="babylon"
DB_PASS="babylon"

echo "🐘 Setting up PostgreSQL for Babylon Finance..."

# Check if psql is installed
if ! command -v psql &> /dev/null
then
    echo "❌ Error: psql is not installed. Please install PostgreSQL first."
    exit 1
fi

# Create user and database
echo "👤 Setting up user '$DB_USER'..."
# Try to create the user, if fails, it might already exist
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS' LOGIN;" 2>/dev/null
# Ensure the user has LOGIN permission even if it already existed without it
sudo -u postgres psql -c "ALTER ROLE $DB_USER WITH LOGIN;"
sudo -u postgres psql -c "ALTER ROLE $DB_USER WITH PASSWORD '$DB_PASS';"

echo "🗄️ Setting up database '$DB_NAME'..."
# Try to create the database
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || echo "⚠️ Database already exists or error creating database."
# Ensure the owner is correct
sudo -u postgres psql -c "ALTER DATABASE $DB_NAME OWNER TO $DB_USER;"

echo "✅ Database setup complete!"
echo "You can now run the backend with 'npm run start:dev'."
