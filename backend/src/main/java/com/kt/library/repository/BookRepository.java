package com.kt.library.repository;

import com.kt.library.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // 로그인한 사용자가 만든 책 목록
    List<Book> findByUserId(Long userId);
}
