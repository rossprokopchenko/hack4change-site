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
echo "Debugging DNS resolution for $DB_HOST_NAME..."

# Try to find IPv4 address using nslookup
# We use a pattern that matches either 'Address: 1.2.3.4' or 'Address 1: 1.2.3.4'
DB_HOST=$(nslookup "$DB_HOST_NAME" 2>/dev/null | awk '/^Address [0-9]+: / { print $4 }; /^Address: / { print $2 }' | grep -E '^[0-9.]+$' | head -n 1)

if [ -z "$DB_HOST" ]; then
  echo "Warning: nslookup parsing failed. Trying simpler grep..."
  DB_HOST=$(nslookup "$DB_HOST_NAME" 2>/dev/null | grep -E 'Address' | grep -v '#' | sed 's/Address[ 0-9:]*//g' | tr -d ' ' | grep -E '^[0-9.]+$' | head -n 1)
fi

if [ -z "$DB_HOST" ]; then
  echo "Warning: nslookup failed. Trying ping resolution..."
  DB_HOST=$(ping -c 1 "$DB_HOST_NAME" 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | head -n 1)
fi

if [ -z "$DB_HOST" ]; then
  echo "Warning: Could not resolve $DB_HOST_NAME to an IPv4 address. Falling back to hostname."
  DB_HOST="$DB_HOST_NAME"
else
  echo "Successfully resolved to IPv4 address: $DB_HOST"
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
