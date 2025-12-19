#!/bin/bash
set -e

APP_ROOT=/home/ec2-user/kt_library
JAR_NAME=$(ls $APP_ROOT/backend/build/libs/*.jar | grep -v plain | tail -n 1)

echo "> 파일 권한 설정"
chown -R ec2-user:ec2-user "$APP_ROOT"
chmod +x "$APP_ROOT/backend/gradlew"

echo "> 현재 실행 중인 애플리케이션 확인 및 종료"
CURRENT_PID=$(pgrep -f "java -jar")
if [ -z "$CURRENT_PID" ]; then
    echo "> 현재 구동 중인 애플리케이션이 없으므로 종료하지 않습니다."
else
    echo "> kill -15 $CURRENT_PID"
    kill -15 $CURRENT_PID
    sleep 5
fi

echo "> 새 애플리케이션 배포"
# nohup을 사용해야 스크립트가 종료되어도 서버가 계속 떠있습니다.
nohup java -jar "$JAR_NAME" > $APP_ROOT/nohup.out 2>&1 &

echo "> 배포 완료"