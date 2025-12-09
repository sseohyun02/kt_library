package com.kt.library.service;

import com.kt.library.dto.request.BookCreateRequest;
import com.kt.library.dto.request.BookUpdateRequest;
import com.kt.library.dto.response.BookResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Book 관련 기능을 모은 interface
public interface BookService {

    // 파라미터에 Long userId 추가
    @Transactional
    BookResponse createBook(BookCreateRequest request, Long userId);

    // 책 조회
    BookResponse getBook(Long id);

    // 저장된 책 목록 조회
    List<BookResponse> getAllBooks();

    // 책 정보 수정
    @Transactional
    BookResponse updateBook(Long id, BookUpdateRequest request);

    // 책 삭제
    @Transactional
    void deleteBook(Long id);

    // 내 책 불러오기
    List<BookResponse> getBooksByUserId(Long userId);

    // 표지 이미지 생성
    String generateAiCover(String prompt, String apiKey);
    // 책 표지 이미지 URL 업데이트 기능
    void updateCoverImage(Long bookId, String coverImageUrl);
}