# Database Backup and Restore

This document describes the automated backup process for the Supabase database and how to perform a restoration.

## 📂 Storage Location

Backups are stored in the `./backups` directory on the host machine.
- **Inside the container**: `/backups`
- **On the host**: `<project_root>/backups`

Files are named with the format: `backup_YYYYMMDD_HHMMSS.sql`.

## ⚙️ How it Works

1. **Automation**: A cron job runs daily at **3:00 AM** inside the `cron` container.
2. **Script**: The process is handled by [backup-db.sh](file:///c:/Git/ctm-hackathon-site/scripts/backup-db.sh).
3. **Rotation**: Only the last **7 days** of backups are kept. Older files are automatically deleted.
4. **Manual Trigger**: You can trigger a backup manually at any time:
   ```bash
   docker exec -it hack4change-cron /scripts/backup-db.sh
   ```

## 🔄 Restore Process

To restore the database from a backup file, follow these steps:

### 1. Identify the Backup File
Go to the `./backups` folder and choose the `.sql` file you want to restore.

### 2. Copy the File to the Container
You can run the restoration from any container that has `postgresql-client` (like the `cron` container).

```bash
# Example: Copy a specific backup to the cron container
docker cp ./backups/backup_20260127_030000.sql hack4change-cron:/tmp/restore.sql
```

### 3. Run the Restore Command
Use `psql` to execute the SQL dump against your Supabase database. You will need your `SUPABASE_DB_PASSWORD`.

```bash
docker exec -it -e PGPASSWORD=your_db_password hack4change-cron psql \
  -h db.your-project-id.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  -f /tmp/restore.sql
```

> [!WARNING]
> Restoring a database will overwrite existing data. Ensure you have a current backup before performing a restore.

### 4. Cleanup
After restoration, remove the temporary file from the container:
```bash
docker exec hack4change-cron rm /tmp/restore.sql
```

## 🔑 Required Credentials
The backup and restore processes require the following environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Used to extract the project ID.
- `SUPABASE_DB_PASSWORD`: The database password found in Supabase Project Settings.
