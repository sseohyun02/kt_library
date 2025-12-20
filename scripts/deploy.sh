#!/bin/bash

echo ">>> 백엔드 배포 시작..."
cd /home/ec2-user/kt_library/backend

CURRENT_PID=$(pgrep -f "library-0.0.1-SNAPSHOT.jar")
if [ -z "$CURRENT_PID" ]; then
    echo ">>> 현재 실행 중인 애플리케이션이 없습니다."
else
    echo ">>> 실행 중인 애플리케이션 종료: $CURRENT_PID"
    kill -15 $CURRENT_PID
    sleep 5
    pkill -f "library-0.0.1-SNAPSHOT.jar" || true
fi

chmod +x gradlew
./gradlew build -x test

JAR_PATH=$(ls build/libs/*.jar | grep -v "plain")
echo ">>> JAR 실행: $JAR_PATH"
nohup java -jar $JAR_PATH > app.log 2>&1 &


echo ">>> 프론트엔드 배포 시작..."
cd /home/ec2-user/kt_library/frontend

npm ci
npm run build

echo ">>> 빌드 결과물을 Nginx 폴더로 이동"
cp -r dist/* /var/www/test-angular-project/

echo ">>> 배포 완료!"
