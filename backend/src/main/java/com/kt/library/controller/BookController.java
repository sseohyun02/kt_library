package com.kt.library.controller;

import com.kt.library.dto.request.BookCoverUrlRequest;
import com.kt.library.dto.request.BookCreateRequest;
import com.kt.library.dto.request.BookUpdateRequest;
import com.kt.library.dto.response.BookResponse;
import com.kt.library.dto.response.UserResponse;
import com.kt.library.exception.UnAuthorizedException;
import com.kt.library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.kt.library.dto.request.BookAiImageRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    // 전체 목록
    @GetMapping
    public List<BookResponse> getBooks() {
        return bookService.getAllBooks();
    }

    // 상세 조회
    @GetMapping("/{bookId}")
    public BookResponse getBook(@PathVariable Long bookId) {
        return bookService.getBook(bookId);
    }

    // 책 생성
    @PostMapping
    public BookResponse createBook(
            @RequestBody BookCreateRequest request,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        // 로그인인 안 된 경우 차단
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }
        return bookService.createBook(request, loginUser.getId());
    }

    // 책 수정
    @PutMapping("/{bookId}")
    public BookResponse updateBook(@PathVariable Long bookId, @RequestBody BookUpdateRequest request) {
        return bookService.updateBook(bookId, request);
    }

    // 삭제
    @DeleteMapping("/{bookId}")
    public void deleteBook(@PathVariable Long bookId) {
        bookService.deleteBook(bookId);
    }

    // 나의 책 조회
    @GetMapping("/my")
    public List<BookResponse> getMyBooks(
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }

        return bookService.getBooksByUserId(loginUser.getId());
    }

    // 프론트에서 URL 받아서 저장하는 API
    @PutMapping("/ai-image")
    public void updateAiImage(@RequestBody BookCoverUrlRequest request) {
        bookService.updateCoverImage(request.getBookId(), request.getCoverImageUrl());
    }

    // AI 표지 생성: 프론트에서 prompt + apiKey를 보내면 백엔드가 OpenAI 호출
    @PostMapping("/ai-cover")
    public ResponseEntity<String> generateAiCover(
            @RequestBody BookAiImageRequest request
    ) {
        String imageUrl = bookService.generateAiCover(
                request.getPrompt(),
                request.getApiKey()
        );

        return ResponseEntity.ok(imageUrl);
    }
}

//    // (새 기능) 백엔드가 직접 AI로 이미지 생성하는 API
//    @PostMapping("/{bookId}/generate-cover")
//    public BookResponse generateAiCover(
//            @PathVariable Long bookId,
//            @RequestBody Map<String, String> requestBody
//    ) {
//        String prompt = requestBody.get("prompt");
//
//        // AI 생성 + 저장
//        bookService.generateAiCover(bookId, prompt);
//
//        // 저장 후 최신 데이터 반환
//        return bookService.getBook(bookId);
//    }
//}