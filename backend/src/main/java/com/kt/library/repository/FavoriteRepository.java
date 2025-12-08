package com.kt.library.repository;

import com.kt.library.domain.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserIdAndBookId(Long userId, Long bookId);

    Long countByBookId(Long bookId);
}
