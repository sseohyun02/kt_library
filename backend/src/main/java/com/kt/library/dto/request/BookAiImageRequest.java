package com.kt.library.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookAiImageRequest {
    private String prompt;  // AI에게 생성 요청할 이미지 설명
}
