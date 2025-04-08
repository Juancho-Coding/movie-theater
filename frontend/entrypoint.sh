#!/bin/sh

# Generate env.js at runtime
cat <<EOF > /usr/share/nginx/html/env.js
window.env = {
  VITE_BASE_URL: "${VITE_BASE_URL}",
  VITE_BASE_IO_URL: "${VITE_BASE_IO_URL}",
}
EOF

# Start NGINX
nginx -g "daemon off;"