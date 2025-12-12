package com.kt.library.service;

public interface LikeService {
    boolean toggleLike(Long bookId, Long userId);

    int getLikeCount(Long bookId);

    // 추가: 유저가 해당 책 좋아요 눌렀는지 확인
    boolean isLiked(Long bookId, Long userId);
}


