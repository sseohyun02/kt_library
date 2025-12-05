package com.kt.library.service.impl;

import com.kt.library.domain.Book;
import com.kt.library.repository.BookRepository;
import com.kt.library.service.BookService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// BookService interface에서 정의한 기능들을 실제 구현하는 클래스
@Service
@RequiredArgsConstructor // BookRepository 생성자 자동 주입
public class BookServiceImpl implements BookService {

    // DB와 연결되는 저장소. 책 저장,조회,삭제 기능을 제공
    private final BookRepository bookRepository;

    // 사용자가 입력한 제목, 내용, 장르 등으로 새로운 책을 DB에 저장한다.
    @Override
    public Book createBook(Book book) {
        // DB에 저장
        return bookRepository.save(book);
    }


    // bookid로 책 조회
    @Override
    public Book getBook(Long id) {

        // findById는 Optional 반환 → 없으면 예외 발생시킴
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));
    }


    // 전체 도서 목록 조회
    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }



    // 해당 ID의 책을 찾아서 제목/내용/장르 등을 변경
    @Override
    public Book updateBook(Long id, Book updatedBook) {

        // 기존 데이터 먼저 가져오기
        Book book = getBook(id);

        // 명세서에 있는 필드들만 수정
        if (updatedBook.getTitle() != null)   book.setTitle(updatedBook.getTitle());
        if (updatedBook.getContent() != null) book.setContent(updatedBook.getContent());
        if (updatedBook.getGenre() != null)   book.setGenre(updatedBook.getGenre());
        if (updatedBook.getLanguage() != null)book.setLanguage(updatedBook.getLanguage());


        // 변경된 값을 다시 저장
        return bookRepository.save(book);
    }



    // bookId에 해당하는 책을 삭제
    @Override
    public void deleteBook(Long id) {

        // 존재 여부 확인 (없으면 에러 발생)
        Book book = getBook(id);

        // 삭제 수행
        bookRepository.delete(book);
    }
}
