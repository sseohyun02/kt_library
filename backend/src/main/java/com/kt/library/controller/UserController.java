package com.kt.library.controller;

import com.kt.library.dto.request.LoginRequest;
import com.kt.library.dto.request.UserSignupRequest;
import com.kt.library.dto.response.UserResponse;
import com.kt.library.service.UserService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest; // 세션용
import jakarta.servlet.http.HttpSession; // 세션용
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody UserSignupRequest request) {
        UserResponse response = userService.signup(request);
        return ResponseEntity.ok(response);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest){
        // 1) 서비스에게 로그인 검사 요청
        UserResponse loginUser = userService.login(request);

        // 2) 검사 통과 시 세션 생성
        // true: 세션이 없으면 새로 만들고, 있으면 가져온다.
        HttpSession session = httpRequest.getSession(true);

        // 3) 세션에 "loginUser"라는 이름으로 회원 정보 저장
        session.setAttribute("loginUser", loginUser);

        // 4) 성공 응답 반환
        return ResponseEntity.ok(loginUser);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest httpRequest){
        HttpSession session = httpRequest.getSession(false); // 세션이 없으면 null 반환
        if(session!=null){
            session.invalidate(); // 세션 삭제
        }
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
}
