//package com.kt.library.dto.request;
//
//import com.kt.library.domain.Book;
//import lombok.Getter;
//import lombok.Setter;
//
//@Getter
//@Setter
//public class BookCreateRequest {
//
//    private String title;
//    private String content;
//    private String author;
//    private Book.Language language;
//    private Book.Genre genre;
//}


package com.kt.library.dto.request;

import com.kt.library.domain.Book;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookCreateRequest {

    private String title;
    private String content;
    private String author;
    private Book.Language language;
    private Book.Genre genre;

    // ★ 이 한 줄이 없어서 에러가 났던 겁니다!
    // 이제 프론트엔드에서 보낸 apiKey를 여기서 받아서 서비스로 넘겨줍니다.
    private String apiKey;
}