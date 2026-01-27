# Database Backup and Restore

This document describes the automated backup process for the Supabase database and how to perform a restoration.

## 📂 Storage Location

Backups are stored in the `./backups` directory on the host machine.

- **Inside the container**: `/backups`
- **On the host**: `<project_root>/backups`

Files are named with the format: `backup_YYYYMMDD_HHMMSS.sql`.

## ⚙️ How it Works

1. **Automation**: A cron job runs daily at **3:00 AM** inside the `cron` container.
2. **Script**: Processed by [backup-db.sh](file:///c:/Git/ctm-hackathon-site/scripts/backup-db.sh).
3. **Connectivity**: To avoid IPv6 issues on VPS environments, we use the **Supabase Connection Pooler** (IPv4).
4. **Rotation**: Keeps the last **7 days** of backups.
5. **Manual Trigger**:
   ```bash
   docker exec -it hack4change-cron sh /scripts/backup-db.sh
   ```

## 🔄 Restore Process

### 1. Identify the Backup File
Find your `.sql` file in the `./backups` folder.

### 2. Copy the File to the Container
```bash
docker cp ./backups/backup_YYYYMMDD_HHMMSS.sql hack4change-cron:/tmp/restore.sql
```

### 3. Run the Restore Command
Use the **Connection Pooler Host** and port **6543**. 

> [!IMPORTANT]
> When using the pooler, the username MUST be `postgres.[your-project-id]`.

```bash
docker exec -it -e PGPASSWORD=your_db_password hack4change-cron psql \
  -h your-pooler-host.pooler.supabase.com \
  -p 6543 \
  -U postgres.your-project-id \
  -d postgres \
  -f /tmp/restore.sql
```

## 🔑 Required Credentials (.env.local)

- `SUPABASE_POOLER_HOST`: Your Supabase Connection Pooler hostname.
  - **Where to find it**:
    1. Open your **Supabase Dashboard**.
    2. Click the green **Connect** button (top right).
    3. Look for the **Transaction Mode** (or Session Mode) connection string.
    4. The hostname is between the `@` and the `:6543`.
    5. Example format: `aws-0-us-east-1.pooler.supabase.com`
- `SUPABASE_DB_PASSWORD`: Your project's database password.
- `NEXT_PUBLIC_SUPABASE_URL`: (Fallback) used to extract Project ID if pooler is missing.
