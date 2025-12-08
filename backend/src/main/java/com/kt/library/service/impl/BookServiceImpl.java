package com.kt.library.service.impl;

import com.kt.library.domain.Book;
import com.kt.library.dto.request.BookCreateRequest;
import com.kt.library.dto.request.BookUpdateRequest;
import com.kt.library.dto.response.BookResponse;
import com.kt.library.repository.BookRepository;
import com.kt.library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    // 생성
    @Override
    public BookResponse createBook(BookCreateRequest request) {

        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setContent(request.getContent());
        book.setLanguage(request.getLanguage());
        book.setGenre(request.getGenre());

        Book saved = bookRepository.save(book);
        return toResponse(saved);
    }

    // 책 하나 조회
    @Override
    public BookResponse getBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));
        return toResponse(book);
    }

    // 전체 조회
    @Override
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 수정
    @Override
    public BookResponse updateBook(Long id, BookUpdateRequest request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));

        if (request.getTitle() != null)   book.setTitle(request.getTitle());
        if (request.getContent() != null) book.setContent(request.getContent());
        if (request.getLanguage() != null) book.setLanguage(request.getLanguage());
        if (request.getGenre() != null)   book.setGenre(request.getGenre());

        Book updated = bookRepository.save(book);
        return toResponse(updated);
    }

    // 삭제
    @Override
    public void deleteBook(Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));

        bookRepository.delete(book);
    }

    // Entity → Response DTO 변환 공통 메서드
    private BookResponse toResponse(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getContent(),
                book.getAuthor(),
                book.getLanguage(),
                book.getGenre(),
                book.getCreateDate(),
                book.getUpdateDate()
        );
    }
}