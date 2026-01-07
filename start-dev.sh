#!/bin/bash

# -------------------------------
# Config
# -------------------------------
DEFAULT_FRONTEND_PORT=3001
STRAPI_CONTAINER_NAME=strapi
STRAPI_PORT=1337
ENV_FILE="./.env.local"

# -------------------------------
# Step 0: Kill any existing Ngrok session
# -------------------------------
echo "Stopping any existing Ngrok tunnels..."
ngrok kill 2>/dev/null || true

# -------------------------------
# Step 1: Start Strapi Docker container
# -------------------------------
echo "Starting Strapi container..."
docker start $STRAPI_CONTAINER_NAME || echo "Strapi container already running"

# Wait for Strapi to fully start
echo "Waiting for Strapi to initialize..."
sleep 10

# Test if Strapi is actually running
if ! curl -s http://localhost:$STRAPI_PORT >/dev/null 2>&1; then
    echo "⚠️  Strapi not responding on localhost:$STRAPI_PORT, attempting to restart..."
    docker-compose down 2>/dev/null
    docker-compose up -d 2>/dev/null
    sleep 15
fi

# -------------------------------
# Step 2: Find available Next.js port
# -------------------------------
PORT=$DEFAULT_FRONTEND_PORT
while lsof -i:$PORT >/dev/null 2>&1; do
    PORT=$((PORT+1))
done
echo "Using Next.js port: $PORT"

# -------------------------------
# Step 3: Ensure .env.local exists
# -------------------------------
if [ ! -f "$ENV_FILE" ]; then
  echo "Creating $ENV_FILE..."
  cat <<EOL > "$ENV_FILE"
NEXT_PUBLIC_APP_URL=http://localhost:$PORT
NEXT_PUBLIC_STRAPI_URL=/strapi
EOL
fi

# -------------------------------
# Step 4: Start Next.js frontend
# -------------------------------
echo "Starting Next.js frontend on port $PORT..."
NEXT_PUBLIC_APP_PORT=$PORT npm run dev &

# Give Next.js some time to start
sleep 8

# -------------------------------
# Step 5: Start Ngrok for frontend
# -------------------------------
echo "Starting Ngrok for frontend..."
ngrok http $PORT > /dev/null 2>&1 &

# Wait for Ngrok to initialize
sleep 8

# -------------------------------
# Step 6: Detect Ngrok public URL
# -------------------------------
NGROK_URL=$(curl --silent --max-time 10 http://127.0.0.1:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url // empty')
if [ -z "$NGROK_URL" ]; then
    echo "⚠️  Could not get Ngrok URL, retrying..."
    sleep 5
    NGROK_URL=$(curl --silent --max-time 10 http://127.0.0.1:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url // empty')
fi

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get Ngrok URL. Using localhost instead."
    NGROK_URL="http://localhost:$PORT"
else
    echo "✅ Ngrok public URL detected: $NGROK_URL"
fi

# -------------------------------
# Step 7: Update .env.local
# -------------------------------
echo "Updating $ENV_FILE..."

# Create backup
cp "$ENV_FILE" "$ENV_FILE.backup" 2>/dev/null

# Update the URLs
sed -i "s|^NEXT_PUBLIC_APP_URL=.*$|NEXT_PUBLIC_APP_URL=$NGROK_URL|" "$ENV_FILE"
sed -i "s|^NEXT_PUBLIC_STRAPI_URL=.*$|NEXT_PUBLIC_STRAPI_URL=/strapi|" "$ENV_FILE"

# Also set the ngrok URL for local testing
echo "# For local development testing:" >> "$ENV_FILE"
echo "NEXT_PUBLIC_STRAPI_LOCAL=http://localhost:$STRAPI_PORT" >> "$ENV_FILE"

# -------------------------------
# Step 8: Test Strapi endpoints
# -------------------------------
echo "Testing Strapi endpoints..."

echo "1. Testing localhost (for your access):"
if curl -s --max-time 10 "http://localhost:$STRAPI_PORT/api/products?populate=*&pagination[pageSize]=1" >/dev/null 2>&1; then
    echo "   ✅ Localhost:1337 is accessible"
    echo "   Product count from localhost:"
    curl -s "http://localhost:$STRAPI_PORT/api/products?populate=*&pagination[pageSize]=1" | jq -r '.data | length' | xargs echo "   "
else
    echo "   ❌ Cannot access localhost:$STRAPI_PORT"
    echo "   Docker logs:"
    docker logs --tail 5 $STRAPI_CONTAINER_NAME
fi

echo -e "\n2. Testing via Next.js proxy (for ngrok access):"
if curl -s --max-time 10 "http://localhost:$PORT/strapi/api/products?populate=*&pagination[pageSize]=1" >/dev/null 2>&1; then
    echo "   ✅ Next.js proxy is working"
    echo "   Product count via proxy:"
    curl -s "http://localhost:$PORT/strapi/api/products?populate=*&pagination[pageSize]=1" | jq -r '.data | length' | xargs echo "   "
else
    echo "   ⚠️  Next.js proxy not responding yet (may still be starting)"
fi

echo -e "\n3. Testing direct endpoints:"
echo "   Categories:"
curl -s "http://localhost:$STRAPI_PORT/api/categories?pagination[pageSize]=1" | jq -r '.data[0]?.attributes?.Name // "No categories or error"' | xargs echo "   "
echo "   Featured Products:"
curl -s "http://localhost:$STRAPI_PORT/api/products?filters[featured][\$eq]=true&populate=*&pagination[pageSize]=1" | jq -r '.data[0]?.attributes?.Panadol // "No featured products"' | xargs echo "   "

# -------------------------------
# Step 9: Finished
# -------------------------------
echo -e "\n✅ Setup complete!"
echo "========================================"
echo "Frontend:"
echo "  Local:      http://localhost:$PORT"
echo "  Public:     $NGROK_URL"
echo ""
echo "Strapi API:"
echo "  Direct:     http://localhost:$STRAPI_PORT"
echo "  Via Proxy:  http://localhost:$PORT/strapi"
echo "  Admin:      http://localhost:$STRAPI_PORT/admin"
echo "========================================"
echo ""
echo "⚠️  IMPORTANT: For ngrok to work, ensure:"
echo "1. next.config.js has '/strapi' rewrites configured"
echo "2. Strapi CORS allows '$NGROK_URL'"
echo ""
echo "To check if images load via ngrok, visit:"
echo "$NGROK_URL"
echo ""
echo "Debug commands:"
echo "  Strapi logs: docker logs -f $STRAPI_CONTAINER_NAME"
echo "  Ngrok status: curl http://127.0.0.1:4040/api/tunnels"
echo "  Test proxy: curl $NGROK_URL/strapi/api/products"