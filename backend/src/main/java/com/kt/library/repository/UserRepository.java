package com.kt.library.repository;

import com.kt.library.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 아이디 중복 체크
    Optional<User> findByLoginId(String loginId);

    // 이메일 중복 체크
    boolean existsByEmail(String email);
}