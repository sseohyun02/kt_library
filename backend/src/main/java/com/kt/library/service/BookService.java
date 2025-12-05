package com.kt.library.service;
import com.kt.library.entity.book;
import java.util.List;

// Book 관련 기능을 모은 interface
public interface BookService {

    // 새로운 책 등록
    Book createBook(Book book);

    // 책 조회
    Book getBook(Long id);

    // 저장된 책 목록 조회
    List<Book> getAllBooks();

    // 책 정보 수정
    Book updateBook(Long id, Book book);

    // 책 삭제
    void deleteBook(Long id);

}
