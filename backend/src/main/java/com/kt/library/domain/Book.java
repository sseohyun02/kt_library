package com.kt.library.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BOOK")

public class Book {
    // 기본키 (PK)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOOK_ID")   // DB 컬럼명
    private Long id;

    // 외래키 (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "USER_ID")
    private User user;

    // 책 제목 (NOT NULL)
    @Column(name = "TITLE", nullable = false, length = 255)
    private String title;

    // 표지
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "IMAGE_ID")
    private Image image;

    // 내용 (NOT NULL, 길이가 길 수 있으니 TEXT로 설정)
    @Column(name = "CONTENT", nullable = false, columnDefinition = "TEXT")
    private String content;

    // 작가 (NOT NULL)
    @Column(name = "AUTHOR", nullable = false, length = 255)
    private String author;

    // 언어
    @Enumerated(EnumType.STRING)
    private Language language;

    public enum Language {
        KO, EN, JP, CN
    }

    //장르
    @Enumerated(EnumType.STRING)
    private Genre genre;

    public enum Genre {
        NOVEL, ESSAY, HISTORY, FANTASY
    }

    // 생성 날짜
    @Column(name = "CREATE_DATE", updatable = false)
    private LocalDateTime createDate;

    // 수정 날짜
    @Column(name = "UPDATE_DATE")
    private LocalDateTime updateDate;

    // 자동 날짜 설정 부분
    @PrePersist
    public void onCreate() {
        this.createDate = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updateDate = LocalDateTime.now();
    }

    // 좋아요 수
    @Column(name = "LIKE_COUNT", nullable = false)
    private int likeCount = 0;
}
