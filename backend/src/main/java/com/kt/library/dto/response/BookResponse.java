package com.kt.library.dto.response;

import com.kt.library.domain.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String content;
    private Book.Language language;
    private Book.Genre genre;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}