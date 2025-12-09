package com.kt.library.service.impl;

import com.kt.library.domain.User;
import com.kt.library.dto.request.LoginRequest;
import com.kt.library.dto.request.UserSignupRequest;
import com.kt.library.dto.response.UserResponse;
import com.kt.library.repository.UserRepository;
import com.kt.library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse signup(UserSignupRequest request) {

        // 1. 아이디(loginId) 중복 체크
        if (userRepository.findByLoginId(request.getLoginId()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 2. 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 3. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 4. User 엔티티 생성
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setLoginId(request.getLoginId());
        user.setPassword(encodedPassword);

        // 5. DB 저장
        User saved = userRepository.save(user);

        // 6. 응답 DTO로 반환
        return new UserResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse login(LoginRequest request){

        // 1. 아이디로 회원 조회 (수정!)
        User user = userRepository.findByLoginId(request.getLoginId())  // ← email → loginId
                .orElseThrow(() -> new IllegalArgumentException("아이디가 존재하지 않습니다."));  // ← 메시지 수정

        // 2. 비밀번호 확인
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인 성공 시 회원 정보 반환
        return new UserResponse(user);
    }
}