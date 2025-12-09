package com.kt.library.service;

import com.kt.library.dto.request.CommentCreateRequest;
import com.kt.library.dto.request.CommentUpdateRequest;
import com.kt.library.dto.response.CommentResponse;

import java.util.List;

public interface CommentService {

    CommentResponse createComment(Long userId, Long bookId, CommentCreateRequest request);

    List<CommentResponse> getCommentsByBook(Long bookId);

    CommentResponse updateComment(Long commentId, Long userId, CommentUpdateRequest request);

    void deleteComment(Long commentId, Long userId);
}
