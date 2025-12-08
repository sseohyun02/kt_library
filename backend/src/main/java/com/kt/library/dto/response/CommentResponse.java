package com.kt.library.dto.response;

import com.kt.library.domain.Comment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResponse {

    private Long id;
    private String content;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.userName = comment.getUser().getName(); // User 엔티티에 name 있다고 가정
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
    }
}
