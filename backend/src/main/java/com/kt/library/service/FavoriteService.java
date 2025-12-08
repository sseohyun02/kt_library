package com.kt.library.service;

public interface FavoriteService {

    void toggleFavorite(Long userId, Long bookId);

    Long getFavoriteCount(Long bookId);
}
