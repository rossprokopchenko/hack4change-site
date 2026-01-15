# Deployment Guide

This guide explains how to deploy the Hack4Change site to a production VPS using Docker.

## Prerequisites

-   A VPS (Virtual Private Server) running Ubuntu or Debian.
-   SSH access to the VPS.
-   A domain name pointing to your VPS IP address (optional but recommended).

## 1. Install Docker

## 2. Deploy the Application

1.  **Clone the repository** on your VPS:
    ```bash
    git clone https://github.com/rossprokopchenko/hack4change-site.git
    cd hack4change-site
    ```

2.  **Configure Environment Variables**:
    Create a `.env.local` file with your production secrets.
    ```bash
    cp example.env.local .env.local
    nano .env.local
    ```
    *Update the values with your production Supabase keys and other secrets.*

3.  **Start the Container**:
    ```bash
    sudo docker compose up -d --build
    ```

    The application should now be running on port 3000.

## 3. Updating the Application

To update the application with the latest code:

```bash
# Pull latest changes
git pull

# Rebuild and restart containers
sudo docker compose up -d --build
```

## 4. (Optional) Nginx Reverse Proxy with SSL

It is recommended to use Nginx as a reverse proxy to handle SSL termination and forward traffic from port 80/443 to port 3000.

1.  **Install Nginx**:

    ```bash
    sudo apt install nginx certbot python3-certbot-nginx
    ```

2.  **Configure Nginx**:
    Create a new configuration file:

    ```bash
    sudo nano /etc/nginx/sites-available/hack4change
    ```

    Add the following content (replace `yourdomain.com` with your actual domain):

    ```nginx
    server {
        server_name yourdomain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3. **Enable the Site**:

    ```bash
    sudo ln -s /etc/nginx/sites-available/hack4change /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

4. **Setup SSL**:

    ```bash
    sudo certbot --nginx -d yourdomain.com
    ```

## 5. Troubleshooting Performance

If the site feels slow or unresponsive:

1. **Run the Diagnostic Script**:
    ```bash
    chmod +x debug-vps.sh
    ./debug-vps.sh
    ```

2. **Monitor Logs in Real-time**:
    ```bash
    sudo docker compose logs -f
    ```

3. **Check Resource Limits**:
    The application is limited to 512MB RAM in `docker-compose.yml`. If `docker stats` shows memory consistently hitting this limit, monitor the logs for memory leaks.

## 6. Blocking Malicious IPs

If you see a single IP hammering your server in `debug-vps.sh`, you can block it using `iptables` on your VPS:

```bash
# Block an IP (replace 1.2.3.4 with the actual IP)
sudo iptables -A INPUT -s 1.2.3.4 -j DROP

# View current blocks
sudo iptables -L -n
```

Alternatively, if you are using `ufw`:

```bash
sudo ufw deny from 1.2.3.4
```

## 7. Automated Protection with Fail2Ban

To automatically block bots that switch IPs, you can set up Fail2Ban on your VPS:

1. **Install Fail2Ban**:
   ```bash
   sudo apt update
   sudo apt install fail2ban
   ```

2. **Deploy Configuration**:
   ```bash
   # Copy the filter
   sudo cp fail2ban/filter-hack4change.conf /etc/fail2ban/filter.d/
   
   # Copy the jail settings (and rename to avoid conflict)
   sudo cp fail2ban/jail.local /etc/fail2ban/jail.d/hack4change.conf
   ```

3. **Verify Log Path**:
   Ensure `logpath` in `/etc/fail2ban/jail.d/hack4change.conf` matches your actual deployment directory.

4. **Restart Fail2Ban**:
   ```bash
   sudo systemctl restart fail2ban
   sudo fail2ban-client status hack4change
   ```
