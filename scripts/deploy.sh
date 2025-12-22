#!/bin/bash

echo ">>> 백엔드 실행 시작"
cd /home/ec2-user/kt_library/backend

CURRENT_PID=$(pgrep -f ".jar")
if [ -n "$CURRENT_PID" ]; then
  echo ">>> 기존 프로세스 종료: $CURRENT_PID"
  kill -15 $CURRENT_PID
  sleep 5
fi

JAR_PATH=$(ls *.jar)
echo ">>> 실행할 JAR: $JAR_PATH"

nohup java -jar $JAR_PATH \
  --server.port=8080 \
  > app.log 2>&1 &

echo ">>> 백엔드 실행 완료"