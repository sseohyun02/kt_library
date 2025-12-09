package com.kt.library.controller;

import com.kt.library.dto.response.UserResponse;
import com.kt.library.exception.UnAuthorizedException;
import com.kt.library.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{bookId}")
    public String toggleLike(
            @PathVariable Long bookId,
            @SessionAttribute(name="loginUser", required = false)UserResponse loginUser
            ) {

        // 1. 로그인 체크
        if(loginUser == null){
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }

        // 2. 서비스 호출
        boolean liked = likeService.toggleLike(bookId, loginUser.getId());

        return liked ? "좋아요 추가됨" : "좋아요 취소됨";
    }
}
