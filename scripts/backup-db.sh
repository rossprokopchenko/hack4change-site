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

# Extract project ID if needed
if [ -z "$SUPABASE_PROJECT_ID" ] && [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  SUPABASE_PROJECT_ID=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's|https?://([^.]+)\..*|\1|')
  echo "ℹ️ Extracted project ID: $SUPABASE_PROJECT_ID"
fi

# Determine Host, Port, and User
if [ -n "$SUPABASE_POOLER_HOST" ]; then
  if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "❌ Error: SUPABASE_PROJECT_ID is required when using the Connection Pooler."
    exit 1
  fi
  echo "ℹ️ Using Supabase Connection Pooler: $SUPABASE_POOLER_HOST"
  DB_HOST_NAME="$SUPABASE_POOLER_HOST"
  DB_PORT=6543 # Supabase Pooler default
  # IMPORTANT: Connection Pooler requires username in the format: postgres.[PROJECT_ID]
  DB_USER="postgres.$SUPABASE_PROJECT_ID"
else
  if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "❌ Error: SUPABASE_PROJECT_ID or NEXT_PUBLIC_SUPABASE_URL must be set."
    exit 1
  fi
  DB_HOST_NAME="db.$SUPABASE_PROJECT_ID.supabase.co"
  DB_PORT=5432
  DB_USER="postgres"
  echo "⚠️ Using direct connection (no pooler): $DB_HOST_NAME"
fi

DB_NAME="postgres"

# 2. DNS Resolution
echo "[2/6] Resolving database host: $DB_HOST_NAME"
# Try to find IPv4 address
DB_HOST=$(dig +short A "$DB_HOST_NAME" | grep -E '^[0-9.]+$' | head -n 1)

if [ -z "$DB_HOST" ]; then
  echo "⚠️ Warning: dig +short A failed. Trying full resolution..."
  DB_HOST=$(nslookup "$DB_HOST_NAME" 2>/dev/null | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}' | grep -v '^127\.' | head -n 1)
fi

if [ -z "$DB_HOST" ]; then
  echo "❌ Error: Could not resolve $DB_HOST_NAME to an IPv4 address."
  echo "DNS Diagnostic Info:"
  nslookup "$DB_HOST_NAME" || true
  exit 1
fi
echo "✅ Resolved $DB_HOST_NAME to $DB_HOST"

# 3. Network Connectivity (Port Test)
echo "[3/6] Testing connectivity to $DB_HOST on port $DB_PORT..."
if command -v nc >/dev/null 2>&1; then
  if nc -z -v -w 10 "$DB_HOST" "$DB_PORT"; then
    echo "✅ Port $DB_PORT is reachable."
  else
    echo "❌ Error: Cannot reach $DB_HOST on port $DB_PORT."
    echo "Diagnostic: Ensure outbound traffic to $DB_PORT is allowed and Supabase Pooler is enabled."
    exit 1
  fi
else
  echo "⚠️ Skip: nc (netcat) not found."
fi

# 4. Authentication Check
echo "[4/6] Verifying database credentials..."
export PGPASSWORD="$SUPABASE_DB_PASSWORD"
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
  echo "✅ Credentials verified."
else
  echo "❌ Error: Authentication failed."
  echo "Actual psql error:"
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
  echo "✅ Backup successful."
else
  echo "❌ Error: pg_dump failed."
  exit 1
fi

# 6. Rotation
echo "[6/6] Rotating old backups..."
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete
echo "✅ Done."

echo "=========================================="
echo "Backup Completed Successfully"
echo "=========================================="
