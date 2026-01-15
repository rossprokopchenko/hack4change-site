#!/bin/bash

# Hack4Change Production Diagnostic Script
# Run this on your VPS to identify performance bottlenecks.

echo "=========================================="
echo "  Hack4Change Production Diagnostics"
echo "  Time: $(date)"
echo "=========================================="

echo -e "\n1. Container Health Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep hack4change

echo -e "\n2. Resource Usage (Live):"
docker stats --no-stream hack4change-site hack4change-nginx

echo -e "\n3. Cache and Tmpfs Usage:"
docker exec hack4change-site df -h | grep -E "tmpfs|cache"

echo -e "\n4. Recent Application Logs (Errors):"
docker logs --tail 50 hack4change-site 2>&1 | grep -iE "error|warn|memory|leak|timeout"

echo -e "\n5. Recent Nginx Error Logs:"
docker logs --tail 50 hack4change-nginx 2>&1 | grep -iE "error|limiting|burst|denied"

echo -e "\n6. VPS System Load:"
uptime

echo "=========================================="
echo "Diagnostics Complete."
