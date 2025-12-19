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
    public boolean toggleLike(
            @PathVariable Long bookId,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser) {

        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }

        return likeService.toggleLike(bookId, loginUser.getId());
    }

    @GetMapping("/{bookId}/count")
    public int getLikeCount(@PathVariable Long bookId) {
        return likeService.getLikeCount(bookId);
    }

    @GetMapping("/{bookId}/status")
    public boolean checkUserLike(
            @PathVariable Long bookId,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) return false; // 로그인 안 했으면 당연히 좋아요 false
        return likeService.isLiked(bookId, loginUser.getId());
    }

    @GetMapping("/{bookId}/is-liked")
    public boolean isLiked(
            @PathVariable Long bookId,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) return false;
        return likeService.isLiked(bookId, loginUser.getId());
    }
}
