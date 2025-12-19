#!/bin/bash
set -e

APP_ROOT=/home/ec2-user/kt_library
BACKEND_ROOT=$APP_ROOT/backend

echo "> 1. 빌드 시작 (EC2 내에서 직접 빌드)"
cd "$BACKEND_ROOT"
# 실행 권한 부여
chmod +x ./gradlew
# 빌드 수행 (테스트는 시간과 메모리 절약을 위해 제외)
./gradlew clean build -x test

echo "> 2. JAR 파일 확인"
JAR_NAME=$(ls $BACKEND_ROOT/build/libs/*.jar | grep -v plain | tail -n 1)

if [ -z "$JAR_NAME" ]; then
    echo "> [ERROR] JAR 파일이 생성되지 않았습니다."
    exit 1
fi

echo "> 3. 파일 권한 설정"
chown -R ec2-user:ec2-user "$APP_ROOT"

echo "> 4. 기존 서버 종료"
CURRENT_PID=$(pgrep -f "java -jar")
if [ ! -z "$CURRENT_PID" ]; then
    kill -15 $CURRENT_PID
    sleep 5
fi

echo "> 5. 새 애플리케이션 실행"
# 로그를 남기기 위해 nohup.out 경로 지정
nohup java -jar "$JAR_NAME" > "$APP_ROOT/nohup.out" 2>&1 &

echo "> 배포 성공!"