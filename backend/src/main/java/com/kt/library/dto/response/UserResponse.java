package com.kt.library.dto.response;

import com.kt.library.domain.User;
import lombok.Getter;

@Getter
public class UserResponse {

    private Long id;
    private String loginId;
    private String name;
    private String email;

    public UserResponse(User user) {
        this.id = user.getId();
        this.loginId = user.getLoginId();
        this.name = user.getName();
        this.email = user.getEmail();
    }
}