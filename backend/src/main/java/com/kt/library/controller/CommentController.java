package com.kt.library.controller;

import com.kt.library.domain.User;
import com.kt.library.dto.request.CommentCreateRequest;
import com.kt.library.dto.request.CommentUpdateRequest;
import com.kt.library.dto.response.CommentResponse;
import com.kt.library.dto.response.UserResponse;
import com.kt.library.exception.UnAuthorizedException;
import com.kt.library.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    // 댓글 생성
    @PostMapping("/{bookId}")
    public CommentResponse createComment(
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser,
            @PathVariable Long bookId,
            @RequestBody CommentCreateRequest request
    ) {
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }
        // 서비스 호출 - 순서: userId, bookId, request
        return commentService.createComment(loginUser.getId(), bookId, request);
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
            @RequestBody CommentUpdateRequest request,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) throw new UnAuthorizedException("로그인이 필요합니다.");

        return commentService.updateComment(commentId, loginUser.getId(), request);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public void deleteComment(
            @PathVariable Long commentId,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) throw new UnAuthorizedException("로그인이 필요합니다.");

        commentService.deleteComment(commentId, loginUser.getId());
    }
}
