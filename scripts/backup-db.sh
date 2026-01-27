#!/bin/sh

# Exit on error
set -e

echo "=========================================="
echo "Starting Database Backup Process"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# 1. Environment Check
echo "[1/6] Checking environment variables..."
if [ -z "$SUPABASE_DB_PASSWORD" ]; then
  echo "❌ Error: SUPABASE_DB_PASSWORD is not set."
  exit 1
fi
echo "✅ SUPABASE_DB_PASSWORD is set."

if [ -z "$SUPABASE_PROJECT_ID" ] && [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  SUPABASE_PROJECT_ID=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's|https?://([^.]+)\..*|\1|')
  echo "ℹ️ Extracted project ID from URL: $SUPABASE_PROJECT_ID"
fi

if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "❌ Error: SUPABASE_PROJECT_ID or NEXT_PUBLIC_SUPABASE_URL must be set."
  exit 1
fi

DB_HOST_NAME="db.$SUPABASE_PROJECT_ID.supabase.co"
DB_PORT=5432
DB_NAME="postgres"
DB_USER="postgres"

# 2. DNS Resolution
echo "[2/6] Resolving database host: $DB_HOST_NAME"
# Attempt to get IPv4 only to avoid IPv6 "Network unreachable"
DB_HOST=$(dig +short A "$DB_HOST_NAME" | grep -E '^[0-9.]+$' | head -n 1)

if [ -z "$DB_HOST" ]; then
  echo "⚠️ Warning: dig failed to find an A record. Falling back to standard resolution."
  DB_HOST=$(nslookup "$DB_HOST_NAME" 2>/dev/null | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}' | grep -v '^127\.' | head -n 1)
fi

if [ -z "$DB_HOST" ]; then
  echo "❌ Error: Could not resolve $DB_HOST_NAME to any IPv4 address."
  echo "Full DNS Info (debug):"
  nslookup "$DB_HOST_NAME" || true
  exit 1
fi
echo "✅ Resolved $DB_HOST_NAME to $DB_HOST"

# 3. Network Connectivity (Port Test)
echo "[3/6] Testing connectivity to $DB_HOST on port $DB_PORT..."
if command -v nc >/dev/null 2>&1; then
  if nc -z -w 5 "$DB_HOST" "$DB_PORT"; then
    echo "✅ Port $DB_PORT is reachable."
  else
    echo "❌ Error: Cannot reach $DB_HOST on port $DB_PORT (Connection timed out or refused)."
    echo "This usually means a firewall on the VPS is blocking outgoing traffic or Supabase is rejecting it."
    exit 1
  fi
else
  echo "⚠️ Skip: nc (netcat) not found, skipping port test."
fi

# 4. Authentication Check
echo "[4/6] Verifying database credentials..."
export PGPASSWORD="$SUPABASE_DB_PASSWORD"
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
  echo "✅ Credentials verified successfully."
else
  echo "❌ Error: Authentication failed or database is not accepting connections."
  echo "Check if your SUPABASE_DB_PASSWORD is correct and matches what is in the Supabase dashboard."
  # Attempt to show the actual error message
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" || true
  exit 1
fi

# 5. Database Dump
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

echo "[5/6] Creating backup: $BACKUP_FILE"
mkdir -p "$BACKUP_DIR"

if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"; then
  echo "✅ Backup completed successfully."
else
  echo "❌ Error: pg_dump failed."
  exit 1
fi

# 6. Rotation and Cleanup
echo "[6/6] Rotating old backups (keeping last 7 days)..."
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete
echo "✅ Done."

echo "=========================================="
echo "Process Finished Successfully"
echo "=========================================="
