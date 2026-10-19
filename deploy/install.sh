#!/usr/bin/env bash
# Run with sudo: installs the nginx vhost and issues a Let's Encrypt cert.
set -euo pipefail
cd "$(dirname "$0")"
cp villa7.carlossosa.tech.conf /etc/nginx/sites-available/villa7.carlossosa.tech
ln -sf /etc/nginx/sites-available/villa7.carlossosa.tech /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d villa7.carlossosa.tech --redirect --non-interactive --agree-tos -m dicarlos.sosa@gmail.com
