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
echo "👤 Creating user '$DB_USER'..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS' LOGIN;" 2>/dev/null || echo "⚠️ User already exists or error creating user."

echo "🗄️ Creating database '$DB_NAME'..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || echo "⚠️ Database already exists or error creating database."

echo "✅ Database setup complete!"
echo "You can now run the backend with 'npm run start:dev'."
