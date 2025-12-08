package com.kt.library.service;

import com.kt.library.dto.request.LoginRequest;
import com.kt.library.dto.request.UserSignupRequest;
import com.kt.library.dto.response.UserResponse;

// User 관련 기능을 모은 interface
public interface UserService {
    // 회원가입
    UserResponse signup(UserSignupRequest request);

    UserResponse login(LoginRequest request);
}
