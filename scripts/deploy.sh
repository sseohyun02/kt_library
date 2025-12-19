#!/bin/bash
set -e

# 변수 설정 (경로만 잡고, 파일 찾는 ls 명령어나 변수는 아직 만들지 않음!)
APP_ROOT=/home/ec2-user/kt_library
BACKEND_DIR="$APP_ROOT/backend"
LOG_FILE="$APP_ROOT/backend/app.log"

echo "[1/4] 기존 프로세스 종료"
# 실행 중인 자바가 있으면 끄고, 없으면 넘어감
pkill -f "java.*\.jar" || true

echo "[2/4] 권한 수정 (Root -> ec2-user)"
# 파일 소유권을 ec2-user로 변경 (이게 있어야 권한 에러가 안 남)
sudo chown -R ec2-user:ec2-user "$APP_ROOT"

echo "[3/4] 백엔드 빌드 시작"
if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"
else
    echo "ERROR: $BACKEND_DIR 폴더가 없습니다!"
    exit 1
fi

# -----------------------------------------------------------
# ☕ 자바 경로 설정 (Gradle이 자바를 못 찾는 문제 해결)
# -----------------------------------------------------------
export JAVA_HOME="/usr/lib/jvm/java-17-amazon-corretto"
export PATH=$JAVA_HOME/bin:$PATH

# 실행 권한 주고 빌드 시작
chmod +x gradlew
echo ">>> Gradle Build Running..."
./gradlew clean build -x test

# -----------------------------------------------------------
# 📂 [중요] 빌드가 다 끝난 '지금' 찾아야 에러가 안 납니다!
# -----------------------------------------------------------
echo "[4/4] 서버 실행"
# 가장 최신 JAR 파일 1개를 찾아서 변수에 담음
JAR=$(ls -1t build/libs/*.jar | head -n 1)

# 혹시 빌드가 실패해서 파일이 없을 경우를 대비한 안전장치
if [ -z "$JAR" ]; then
    echo "ERROR: 빌드된 JAR 파일을 찾을 수 없습니다! (빌드 실패)"
    exit 1
fi

echo "Deploying JAR: $JAR"
nohup java -jar "$JAR" > "$LOG_FILE" 2>&1 &

echo ">>> 배포 성공!"
