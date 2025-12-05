package com.kt.library.controller;

import com.kt.library.domain.Book;
import com.kt.library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor

public class BookController {

    private final BookService bookService;

    // 전체 책 조회 (GET /books)
    @GetMapping
    public List<Book> getBooks() {
        return bookService.getAllBooks();
    }

    // 상세조회
    @GetMapping("/{bookId}")
    public Book getBook(@PathVariable Long bookId) {
        return bookService.getBook(bookId);
    }

    // 책 등록
    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return bookService.createBook(book);
    }

    // 책 수정
    @PutMapping("/{bookId}")
    public Book updateBook(
            @PathVariable Long bookId,
            @RequestBody Book updatedBook
    ) {
        return bookService.updateBook(bookId, updatedBook);
    }

    // 책 삭제
    @DeleteMapping("/{bookId}")
    public void deleteBook(@PathVariable Long bookId) {
        bookService.deleteBook(bookId);
    }
}
