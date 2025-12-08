package com.kt.library.controller;

import com.kt.library.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 찜 토글
    @PostMapping("/{bookId}")
    public void toggleFavorite(
            @RequestParam Long userId,
            @PathVariable Long bookId
    ) {
        favoriteService.toggleFavorite(userId, bookId);
    }

    // 현재 책의 찜 개수 조회
    @GetMapping("/{bookId}/count")
    public Long getFavoriteCount(@PathVariable Long bookId) {
        return favoriteService.getFavoriteCount(bookId);
    }
}
