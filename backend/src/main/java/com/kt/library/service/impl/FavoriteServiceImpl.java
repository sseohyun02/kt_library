package com.kt.library.service.impl;

import com.kt.library.domain.Book;
import com.kt.library.domain.Favorite;
import com.kt.library.domain.User;
import com.kt.library.repository.BookRepository;
import com.kt.library.repository.FavoriteRepository;
import com.kt.library.repository.UserRepository;
import com.kt.library.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    public void toggleFavorite(Long userId, Long bookId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // 이미 찜했는지 체크
        Favorite favorite = favoriteRepository
                .findByUserIdAndBookId(userId, bookId)
                .orElse(null);

        if (favorite != null) {
            // 이미 찜한 상태 → 찜 취소
            favoriteRepository.delete(favorite);
        } else {
            // 찜 추가
            favoriteRepository.save(
                    Favorite.builder()
                            .user(user)
                            .book(book)
                            .build()
            );
        }
    }

    @Override
    public Long getFavoriteCount(Long bookId) {
        return favoriteRepository.countByBookId(bookId);
    }
}
