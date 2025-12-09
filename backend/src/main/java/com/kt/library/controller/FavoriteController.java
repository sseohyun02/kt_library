package com.kt.library.controller;

import com.kt.library.dto.response.BookResponse;  // ← 추가!
import com.kt.library.dto.response.UserResponse;
import com.kt.library.exception.UnAuthorizedException;
import com.kt.library.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;  // ← 추가!

@RequiredArgsConstructor
@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 찜 토글
    @PostMapping("/{bookId}")
    public void toggleFavorite(
            @PathVariable Long bookId,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }
        favoriteService.toggleFavorite(loginUser.getId(), bookId);
    }

    // 현재 책의 찜 개수 조회
    @GetMapping("/{bookId}/count")
    public Long getFavoriteCount(@PathVariable Long bookId) {
        return favoriteService.getFavoriteCount(bookId);
    }

    // ← 추가!
    // 내 찜 목록 조회
    @GetMapping
    public List<BookResponse> getMyFavorites(
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }
        return favoriteService.getMyFavorites(loginUser.getId());
    }

    // ← 추가!
        // 내가 이 책을 찜했는지 확인
        @GetMapping("/{bookId}/check")
        public boolean checkFavorited(
                @PathVariable Long bookId,
                @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
        ) {
            if (loginUser == null) {
                return false;  // 로그인 안 했으면 false
            }
            return favoriteService.isFavorited(loginUser.getId(), bookId);
        }
}