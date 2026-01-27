#!/bin/sh

# Exit on error
set -e

echo "Starting database backup..."

# Extract project ID from Supabase URL if not explicitly provided
if [ -z "$SUPABASE_PROJECT_ID" ] && [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  SUPABASE_PROJECT_ID=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's|https?://([^.]+)\..*|\1|')
  echo "Extracted project ID: $SUPABASE_PROJECT_ID"
fi

if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "Error: SUPABASE_PROJECT_ID or NEXT_PUBLIC_SUPABASE_URL must be set."
  exit 1
fi

if [ -z "$SUPABASE_DB_PASSWORD" ]; then
  echo "Error: SUPABASE_DB_PASSWORD must be set."
  exit 1
fi

DB_HOST_NAME="db.$SUPABASE_PROJECT_ID.supabase.co"
echo "Resolving $DB_HOST_NAME (forcing IPv4)..."

# Method 1: dig +short A (best for IPv4-only resolution)
if command -v dig >/dev/null 2>&1; then
  DB_HOST=$(dig +short A "$DB_HOST_NAME" | grep -E '^[0-9.]+$' | head -n 1)
fi

if [ -z "$DB_HOST" ]; then
  echo "Warning: dig failed or not available. Trying getent ahosts..."
  # Method 2: getent ahosts
  DB_HOST=$(getent ahosts "$DB_HOST_NAME" 2>/dev/null | grep STREAM | awk '{print $1}' | grep -E '^[0-9.]+$' | grep -v '^127\.' | head -n 1)
fi

if [ -z "$DB_HOST" ]; then
  echo "Warning: getent ahosts failed. Trying nslookup..."
  # Method 3: nslookup with simple grep -oE
  DB_HOST=$(nslookup "$DB_HOST_NAME" 2>/dev/null | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}' | grep -v '^127\.' | head -n 1)
fi

if [ -z "$DB_HOST" ]; then
  echo "Error: Could not resolve $DB_HOST_NAME to a valid external IPv4 address."
  exit 1
else
  echo "Successfully resolved to IPv4: $DB_HOST"
fi

DB_PORT=5432
DB_NAME="postgres"
DB_USER="postgres"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Dumping database to $BACKUP_FILE..."

# Run pg_dump
# PGPASSWORD is used by pg_dump for authentication
export PGPASSWORD="$SUPABASE_DB_PASSWORD"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

echo "Backup completed successfully: $BACKUP_FILE"

# Basic rotation: keep last 7 days of backups
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete

echo "Done."
