#!/bin/bash
set -e

APP_ROOT=/home/ec2-user/kt_library

# 배포된 파일들이 root 소유로 떨어지는 문제 방지
chown -R ec2-user:ec2-user "$APP_ROOT"

# 실행 권한 보장
chmod -R u+rx "$APP_ROOT/scripts" || true
chmod +x "$APP_ROOT/backend/gradlew" || true
chmod +x "$APP_ROOT/scripts/deploy.sh" || true
