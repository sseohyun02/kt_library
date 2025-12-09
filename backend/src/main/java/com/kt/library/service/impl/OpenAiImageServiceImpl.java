package com.kt.library.service.impl;

import com.kt.library.service.OpenAiImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OpenAiImageServiceImpl implements OpenAiImageService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateImage(String prompt) {

        String url = "https://api.openai.com/v1/images/generations";

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // 바디 설정
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "dall-e-3");
        requestBody.put("prompt", prompt);
        requestBody.put("size", "1024x1024");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // 요청 보내기
        Map response = restTemplate.postForObject(url, request, Map.class);

        // 응답에서 URL 꺼내기
        Map first = (Map)((java.util.List) response.get("data")).get(0);

        return (String) first.get("url");
    }
}
