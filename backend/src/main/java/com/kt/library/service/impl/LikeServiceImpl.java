package com.kt.library.service.impl;

import com.kt.library.domain.Book;
import com.kt.library.domain.Like;
import com.kt.library.domain.User;
import com.kt.library.repository.BookRepository;
import com.kt.library.repository.LikeRepository;
import com.kt.library.repository.UserRepository;
import com.kt.library.service.LikeService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public boolean toggleLike(Long bookId, Long userId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("책 없음"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        Optional<Like> existing = likeRepository.findByBookIdAndUserId(bookId, userId);

        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            book.setLikeCount(book.getLikeCount() - 1);
            bookRepository.save(book);
            return false; // 좋아요 취소됨
        }

        Like like = new Like(null, book, user);
        likeRepository.save(like);

        book.setLikeCount(book.getLikeCount() + 1);
        bookRepository.save(book);

        return true; // 좋아요 추가됨
    }
}
