package com.kt.library.interceptor;

import com.kt.library.exception.UnAuthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class LoginCheckInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // 1. 단순 조회 요청은 통과 - CROS 문제 방지
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        // 2. "GET 요청(조회)"은 로그인 안 해도 통과
        if (request.getMethod().equals("GET")) {
            return true;
        }

        // 3. 세션 검사 - 없으면 null 반환
        HttpSession session = request.getSession(false);

        // 4. 세션이 아예 없거나, 있어도 로그인 정보("loginUser")가 없으면
        // session == null: 아예 처음 온 사람
        // session.getAttribute("loginUser") == null: 세션은 있는데 로그인은 안한 사람
        if (session == null || session.getAttribute("loginUser") == null) {
            // 여기서 예외를 던지면 GlobalExceptionHandler가 401로 변환
            throw new UnAuthorizedException("로그인이 필요한 서비스입니다.");
        }

        // 5. 성공 - 다음 단계인 Controller로 이동
        return true;
    }
}
