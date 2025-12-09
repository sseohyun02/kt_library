package com.kt.library.service;

import com.kt.library.dto.response.BookResponse;  // ← 추가!
import java.util.List;  // ← 추가!

public interface FavoriteService {

    void toggleFavorite(Long userId, Long bookId);

    Long getFavoriteCount(Long bookId);

    List<BookResponse> getMyFavorites(Long userId);  // ← 추가!

    boolean isFavorited(Long userId, Long bookId);  // ← 추가!
}