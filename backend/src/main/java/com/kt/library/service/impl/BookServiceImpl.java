//package com.kt.library.service.impl;
//
//import com.kt.library.domain.Book;
//import com.kt.library.domain.User;
//import com.kt.library.dto.request.BookCreateRequest;
//import com.kt.library.dto.request.BookUpdateRequest;
//import com.kt.library.dto.response.BookResponse;
//import com.kt.library.repository.BookRepository;
//import com.kt.library.repository.UserRepository;
//import com.kt.library.service.BookService;
//import com.kt.library.service.OpenAiImageService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class BookServiceImpl implements BookService {
//
//    private final BookRepository bookRepository;
//    private final UserRepository userRepository;
//    private final OpenAiImageService openAiImageService;
//
//    // 생성
//    @Override
//    public BookResponse createBook(BookCreateRequest request, Long userId) {
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 회원입니다."));
//
//        Book book = new Book();
//        book.setTitle(request.getTitle());
//        book.setContent(request.getContent());
//        book.setLanguage(request.getLanguage());
//        book.setGenre(request.getGenre());
//        book.setUser(user);
//        book.setAuthor(user.getName());
//
//
//        Book saved = bookRepository.save(book);
//        return toResponse(saved);
//    }
//
//    // 책 하나 조회
//    @Override
//    public BookResponse getBook(Long id) {
//        Book book = bookRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));
//        return toResponse(book);
//    }
//
//    // 전체 조회
//    @Override
//    public List<BookResponse> getAllBooks() {
//        return bookRepository.findAll()
//                .stream()
//                .map(this::toResponse)
//                .collect(Collectors.toList());
//    }
//
//    // 수정
//    @Override
//    public BookResponse updateBook(Long id, BookUpdateRequest request) {
//
//        Book book = bookRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));
//
//        if (request.getTitle() != null)   book.setTitle(request.getTitle());
//        if (request.getContent() != null) book.setContent(request.getContent());
//        if (request.getLanguage() != null) book.setLanguage(request.getLanguage());
//        if (request.getGenre() != null)   book.setGenre(request.getGenre());
//
//        Book updated = bookRepository.save(book);
//        return toResponse(updated);
//    }
//
//    // 삭제
//    @Override
//    public void deleteBook(Long id) {
//
//        Book book = bookRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));
//
//        bookRepository.delete(book);
//    }
//
//    // 내 책 불러오기
//    @Override
//    public List<BookResponse> getBooksByUserId(Long userId) {
//        List<Book> books = bookRepository.findByUserId(userId);
//        return books.stream()
//                .map(BookResponse::fromEntity)
//                .toList();
//    }
//
//    // 표지 이미지 업데이트
//    @Override
//    public void updateCoverImage(Long bookId, String coverImageUrl) {
//
//        // DB에서 bookId에 해당하는 책 조회
//        Book book = bookRepository.findById(bookId)
//                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));
//
//        // AI가 생성한 이미지 URL 세팅
//        book.setCoverImageUrl(coverImageUrl);
//
//        // 업데이트된 책 정보를 DB에 저장
//        bookRepository.save(book);
//    }
//
//    // 표지 이미지 생성
//    @Override
//    public String generateAiCover(String prompt, String apiKey) {
//        // 1) OpenAI로 이미지 생성 (DB는 건드리지 않음)
//        String imageUrl = openAiImageService.generateImage(prompt, apiKey);
//        return imageUrl;
//    }
//
//    // Entity → Response DTO 변환 공통 메서드
//    private BookResponse toResponse(Book book) {
//        return new BookResponse(
//                book.getId(),
//                book.getTitle(),
//                book.getContent(),
//                book.getAuthor(),
//                book.getLanguage(),
//                book.getGenre(),
//                book.getCreateDate(),
//                book.getUpdateDate(),
//                book.getCoverImageUrl()
//        );
//    }
//
//}


package com.kt.library.service.impl;

import com.kt.library.domain.Book;
import com.kt.library.domain.User;
import com.kt.library.dto.request.BookCreateRequest;
import com.kt.library.dto.request.BookUpdateRequest;
import com.kt.library.dto.response.BookResponse;
import com.kt.library.repository.BookRepository;
import com.kt.library.repository.UserRepository;
import com.kt.library.service.BookService;
import com.kt.library.service.OpenAiImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final OpenAiImageService openAiImageService;

    // [수정됨] 생성: 트랜잭션 적용 + 이미지 생성 로직 통합
    @Override
    @Transactional // ★ 핵심: 이 메서드 안에서 에러가 나면 DB 저장도 모두 취소됨
    public BookResponse createBook(BookCreateRequest request, Long userId) {

        // 1. 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 2. 책 객체 생성
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setContent(request.getContent()); // 이 소개글을 바탕으로 이미지를 만듭니다.
        book.setLanguage(request.getLanguage());
        book.setGenre(request.getGenre());
        book.setUser(user);
        book.setAuthor(user.getName());

        // 3. 책 정보 1차 저장 (ID 생성)
        Book savedBook = bookRepository.save(book);

        // 4. 이미지 생성 시도 (내용이 있을 경우만)
        if (request.getContent() != null && !request.getContent().isBlank()) {
            try {
                log.info("책 표지 이미지 생성 시작 (Book ID: {})", savedBook.getId());

                // ★ OpenAiImageService 호출
                // 여기서 '번역' -> 'Stability AI 호출' -> 'URL 반환'이 이루어집니다.
                // request.getApiKey()는 프론트엔드에서 받은 키입니다.
                String imageUrl = openAiImageService.generateImage(request.getContent(), request.getApiKey());

                // 성공 시 URL 업데이트
                savedBook.setCoverImageUrl(imageUrl);

                // (참고: @Transactional 환경이라 save 호출 없이도 더티체킹으로 저장되지만, 명시적으로 둡니다)
                // bookRepository.save(savedBook);

            } catch (Exception e) {
                // ★ 핵심: 이미지 생성 실패 시 로그를 남기고 예외를 던져서 '책 저장'을 취소시킴
                log.error("이미지 생성 실패로 인해 책 등록을 취소합니다. 원인: {}", e.getMessage());
                throw new RuntimeException("책 표지 이미지를 생성할 수 없어 등록이 취소되었습니다.");
            }
        }

        return toResponse(savedBook);
    }

    // ... (아래는 기존 코드와 동일합니다) ...

    @Override
    public BookResponse getBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));
        return toResponse(book);
    }

    @Override
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long id, BookUpdateRequest request) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("책 없음"));
        if (request.getTitle() != null) book.setTitle(request.getTitle());
        if (request.getContent() != null) book.setContent(request.getContent());
        if (request.getLanguage() != null) book.setLanguage(request.getLanguage());
        if (request.getGenre() != null) book.setGenre(request.getGenre());
        return toResponse(bookRepository.save(book));
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public List<BookResponse> getBooksByUserId(Long userId) {
        return bookRepository.findByUserId(userId).stream().map(BookResponse::fromEntity).toList();
    }

    @Override
    public void updateCoverImage(Long bookId, String coverImageUrl) {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("책 없음"));
        book.setCoverImageUrl(coverImageUrl);
        bookRepository.save(book);
    }

    @Override
    public String generateAiCover(String prompt, String apiKey) {
        return openAiImageService.generateImage(prompt, apiKey);
    }

    private BookResponse toResponse(Book book) {
        return new BookResponse(book.getId(), book.getTitle(), book.getContent(), book.getAuthor(), book.getLanguage(), book.getGenre(), book.getCreateDate(), book.getUpdateDate(), book.getCoverImageUrl());
    }
}