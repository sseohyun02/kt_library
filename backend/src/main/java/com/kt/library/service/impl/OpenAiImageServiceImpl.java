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

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateImage(String prompt, String apiKey) {

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

        try {
            // 요청 보내기
            Map response = restTemplate.postForObject(url, request, Map.class);

            if (response == null) {
                throw new RuntimeException("OpenAI 응답이 null 입니다.");
            }

            Object dataObj = response.get("data");
            if (!(dataObj instanceof java.util.List) || ((java.util.List<?>) dataObj).isEmpty()) {
                throw new RuntimeException("OpenAI 응답에 data 필드가 없거나 비어 있습니다: " + response);
            }

            Map first = (Map) ((java.util.List<?>) dataObj).get(0);
            Object urlObj = first.get("url");
            if (urlObj == null) {
                throw new RuntimeException("OpenAI 응답에 url 필드가 없습니다: " + first);
            }

            return urlObj.toString();

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // 👇 여기 로그 보고 진짜 원인 확인
            System.out.println("=== OpenAI 4xx 오류 ===");
            System.out.println("Status: " + e.getStatusCode());
            System.out.println("Body  : " + e.getResponseBodyAsString());
            throw new RuntimeException("OpenAI 4xx 오류", e);

        } catch (org.springframework.web.client.HttpServerErrorException e) {
            System.out.println("=== OpenAI 5xx 오류 ===");
            System.out.println("Status: " + e.getStatusCode());
            System.out.println("Body  : " + e.getResponseBodyAsString());
            throw new RuntimeException("OpenAI 5xx 오류", e);
        }
    }
}
