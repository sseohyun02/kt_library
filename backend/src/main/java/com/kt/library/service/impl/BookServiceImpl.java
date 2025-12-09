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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final OpenAiImageService openAiImageService;

    // 생성
    @Override
    public BookResponse createBook(BookCreateRequest request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 회원입니다."));

        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setContent(request.getContent());
        book.setLanguage(request.getLanguage());
        book.setGenre(request.getGenre());
        book.setUser(user);
        book.setAuthor(user.getName());


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

    // 내 책 불러오기
    @Override
    public List<BookResponse> getBooksByUserId(Long userId) {
        List<Book> books = bookRepository.findByUserId(userId);
        return books.stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    // 표지 이미지 업데이트
    @Override
    public void updateCoverImage(Long bookId, String coverImageUrl) {

        // DB에서 bookId에 해당하는 책 조회
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("해당 책을 찾을 수 없습니다."));

        // AI가 생성한 이미지 URL 세팅
        book.setCoverImageUrl(coverImageUrl);

        // 업데이트된 책 정보를 DB에 저장
        bookRepository.save(book);
    }

    // 표지 이미지 생성
    @Override
    public String generateAiCover(String prompt, String apiKey) {
        // 1) OpenAI로 이미지 생성 (DB는 건드리지 않음)
        String imageUrl = openAiImageService.generateImage(prompt, apiKey);
        return imageUrl;
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
                book.getUpdateDate(),
                book.getCoverImageUrl()
        );
    }

}