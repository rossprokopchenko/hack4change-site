#!/bin/bash

# Hack4Change Production Diagnostic Script
# Run this on your VPS to identify performance bottlenecks.

# Use sudo for docker commands if not already running as root
DOCKER="sudo docker"
if [ "$(id -u)" -eq 0 ]; then
    DOCKER="docker"
fi

echo "=========================================="
echo "  Hack4Change Production Diagnostics"
echo "  Time: $(date)"
echo "=========================================="

echo -e "\n1. Container Health Status:"
$DOCKER ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep hack4change

echo -e "\n2. Resource Usage (Live):"
$DOCKER stats --no-stream hack4change-site hack4change-nginx

echo -e "\n3. Cache and Tmpfs Usage:"
$DOCKER exec hack4change-site df -h | grep -E "tmpfs|cache"

echo -e "\n4. Top Malicious/Suspicious IPs (Recent Logs):"
# Extract IPs from nginx logs and count occurrences
$DOCKER logs --tail 1000 hack4change-nginx 2>&1 | grep -E "499|504|444|POST" | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 10

echo -e "\n5. Recent Application logs (Errors):"
$DOCKER logs --tail 100 hack4change-site 2>&1 | grep -iE "error|warn|memory|leak|timeout" | tail -n 20

echo -e "\n6. Recent Nginx Error Logs:"
$DOCKER logs --tail 100 hack4change-nginx 2>&1 | grep -iE "error|limiting|burst|denied|timed out" | tail -n 20

echo -e "\n7. VPS System Load:"
uptime

echo "=========================================="
echo "Diagnostics Complete."
