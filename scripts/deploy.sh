#!/bin/bash
set -e

APP_ROOT=/home/ec2-user/kt_library
BACKEND_DIR="$APP_ROOT/backend"
LOG_FILE="$APP_ROOT/backend/app.log"

echo "[1/3] Stop existing app (if any)"
pkill -f "$APP_ROOT/backend/build/libs/.*\.jar" || true
pkill -f "java.*\.jar" || true

echo "[2/3] Build backend"
cd "$BACKEND_DIR"
chmod +x gradlew
./gradlew clean build -x test

echo "[3/3] Start backend"
JAR=$(ls -1t build/libs/*.jar | head -n 1)
nohup java -jar "$JAR" > "$LOG_FILE" 2>&1 &

echo "Started: $JAR"