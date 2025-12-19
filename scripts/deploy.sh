#!/bin/bash

# 1. 백엔드 배포 (기존과 동일)
echo ">>> 백엔드 배포 시작..."
cd /home/ec2-user/kt_library/backend

# 실행 중인 백엔드 종료
CURRENT_PID=$(pgrep -f "kt_library-0.0.1-SNAPSHOT.jar")
if [ -z "$CURRENT_PID" ]; then
    echo ">>> 현재 실행 중인 애플리케이션이 없습니다."
else
    echo ">>> 실행 중인 애플리케이션 종료: $CURRENT_PID"
    kill -15 $CURRENT_PID
    sleep 5
fi

# 백엔드 빌드 및 실행
chmod +x gradlew
./gradlew build -x test

JAR_PATH=$(ls build/libs/*.jar | grep -v "plain")
echo ">>> JAR 실행: $JAR_PATH"
nohup java -jar $JAR_PATH > app.log 2>&1 &


# 2. 프론트엔드 배포 (여기가 추가됨!)
echo ">>> 프론트엔드 배포 시작..."
cd /home/ec2-user/kt_library/frontend

# 의존성 설치 및 빌드
echo ">>> React 의존성 설치 중..."
npm install
echo ">>> React 빌드 중..."
npm run build

# Nginx 폴더로 결과물 이동 (dist 폴더 내용물만 옮김)
echo ">>> 빌드 결과물을 Nginx 폴더로 이동"
sudo cp -r dist/* /var/www/test-angular-project/

echo ">>> 배포 완료!"
