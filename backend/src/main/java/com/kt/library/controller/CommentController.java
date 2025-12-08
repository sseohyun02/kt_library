package com.kt.library.controller;

import com.kt.library.dto.request.CommentCreateRequest;
import com.kt.library.dto.request.CommentUpdateRequest;
import com.kt.library.dto.response.CommentResponse;
import com.kt.library.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    // 댓글 생성
    @PostMapping("/{bookId}")
    public CommentResponse createComment(
            @RequestParam Long userId,
            @PathVariable Long bookId,
            @RequestBody CommentCreateRequest request
    ) {
        return commentService.createComment(userId, bookId, request);
    }

    // 책 기준 댓글 조회
    @GetMapping("/{bookId}")
    public List<CommentResponse> getComments(@PathVariable Long bookId) {
        return commentService.getCommentsByBook(bookId);
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public CommentResponse updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentUpdateRequest request
    ) {
        return commentService.updateComment(commentId, request);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
    }
}
