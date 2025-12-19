#!/bin/bash
set -e

APP_ROOT=/home/ec2-user/kt_library
BACKEND_DIR="$APP_ROOT/backend"
LOG_FILE="$APP_ROOT/backend/app.log"

echo "[1/4] 기존 프로세스 종료"
pkill -f "java.*\.jar" || true

echo "[2/4] 권한 수정"
sudo chown -R ec2-user:ec2-user "$APP_ROOT"

echo "[3/4] 백엔드 빌드 시작"
if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"
else
    echo "ERROR: $BACKEND_DIR 폴더가 없습니다!"
    exit 1
fi

export JAVA_HOME="/usr/lib/jvm/java-17-amazon-corretto"
export PATH=$JAVA_HOME/bin:$PATH

chmod +x gradlew
echo ">>> Gradle Build Running..."
./gradlew clean build -x test

# -----------------------------------------------------------
# 🚨 여기가 수정된 부분입니다! (plain jar 제외)
# -----------------------------------------------------------
echo "[4/4] 서버 실행"
# 1. build/libs 폴더의 모든 jar 파일 중
# 2. 'plain'이라는 글자가 들어간 건 제외하고 (grep -v)
# 3. 가장 최신 파일 1개를 선택
JAR=$(ls -1t build/libs/*.jar | grep -v "plain" | head -n 1)

if [ -z "$JAR" ]; then
    echo "ERROR: 빌드된 JAR 파일을 찾을 수 없습니다!"
    exit 1
fi

echo "Deploying Executable JAR: $JAR"
nohup java -jar "$JAR" > "$LOG_FILE" 2>&1 &

echo ">>> 배포 성공!"
