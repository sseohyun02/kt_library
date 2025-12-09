package com.kt.library.controller;

import com.kt.library.dto.request.BookCreateRequest;
import com.kt.library.dto.request.BookUpdateRequest;
import com.kt.library.dto.response.BookResponse;
import com.kt.library.dto.response.UserResponse;
import com.kt.library.exception.UnAuthorizedException;
import com.kt.library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<BookResponse> getBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{bookId}")
    public BookResponse getBook(@PathVariable Long bookId) {
        return bookService.getBook(bookId);
    }

    @PostMapping
    public BookResponse createBook(@RequestBody BookCreateRequest request,

                                   @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        // 로그인인 안 된 경우 차단
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }
        return bookService.createBook(request, loginUser.getId());
    }

    @PutMapping("/{bookId}")
    public BookResponse updateBook(@PathVariable Long bookId, @RequestBody BookUpdateRequest request) {
        return bookService.updateBook(bookId, request);
    }

    @DeleteMapping("/{bookId}")
    public void deleteBook(@PathVariable Long bookId) {
        bookService.deleteBook(bookId);
    }

    @GetMapping("/my")
    public List<BookResponse> getMyBooks(
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }

        return bookService.getBooksByUserId(loginUser.getId());
    }

}
