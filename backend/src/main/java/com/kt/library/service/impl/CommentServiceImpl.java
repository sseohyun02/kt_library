package com.kt.library.service.impl;

import com.kt.library.domain.Book;
import com.kt.library.domain.Comment;
import com.kt.library.domain.User;
import com.kt.library.dto.request.CommentCreateRequest;
import com.kt.library.dto.request.CommentUpdateRequest;
import com.kt.library.dto.response.CommentResponse;
import com.kt.library.repository.BookRepository;
import com.kt.library.repository.CommentRepository;
import com.kt.library.repository.UserRepository;
import com.kt.library.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    public CommentResponse createComment(Long userId, Long bookId, CommentCreateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Comment comment = Comment.builder()
                .user(user)
                .book(book)
                .content(request.getContent())
                .build();

        commentRepository.save(comment);

        return new CommentResponse(comment);
    }

    @Override
    public List<CommentResponse> getCommentsByBook(Long bookId) {
        return commentRepository.findByBookId(bookId)
                .stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public CommentResponse updateComment(Long commentId, CommentUpdateRequest request) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setContent(request.getContent());

        commentRepository.save(comment);

        return new CommentResponse(comment);
    }

    @Override
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
