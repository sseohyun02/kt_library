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
    private final PasswordEncoder passwordEncoder; // WebConfig 에서 주입

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

        // 1. 아이디로 회원 조회
        // 수정됨: getLoginID() -> getEmail() (소문자 d)
        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("아이디가 존재하지 않습니다."));

        // 2. 비밀번호 확인
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            // 메시지도 조금 더 자연스럽게 수정했습니다 ("존재하지" -> "일치하지")
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인 성공 시 회원 정보 반환
        return new UserResponse(user);
    }
}