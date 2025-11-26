# Deployment Guide

This guide explains how to deploy the Hack4Change site to a production VPS using Docker.

## Prerequisites

-   A VPS (Virtual Private Server) running Ubuntu or Debian.
-   SSH access to the VPS.
-   A domain name pointing to your VPS IP address (optional but recommended).

## 1. Install Docker on VPS

Connect to your VPS via SSH and run the following commands to install Docker and Docker Compose:

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
sudo docker run hello-world
```

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

3.  **Enable the Site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/hack4change /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

4.  **Setup SSL**:
    ```bash
    sudo certbot --nginx -d yourdomain.com
    ```
