package com.kt.library.controller;

import com.kt.library.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{bookId}/like")
    public String toggleLike(
            @PathVariable Long bookId,
            @RequestParam Long userId
    ) {
        boolean liked = likeService.toggleLike(bookId, userId);
        return liked ? "좋아요 추가됨" : "좋아요 취소됨";
    }
}
