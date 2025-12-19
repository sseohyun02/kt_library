//package com.kt.library.service.impl;
//
//import com.kt.library.service.OpenAiImageService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.http.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//public class OpenAiImageServiceImpl implements OpenAiImageService {
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    @Override
//    public String generateImage(String prompt, String apiKey) {
//
//        String url = "https://api.openai.com/v1/images/generations";
//
//        // 헤더 설정
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.setBearerAuth(apiKey);
//
//        // 바디 설정
//        Map<String, Object> requestBody = new HashMap<>();
//        requestBody.put("model", "dall-e-3");
//        requestBody.put("prompt", prompt);
//        requestBody.put("size", "1024x1024");
//
//        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
//
//        try {
//            // 요청 보내기
//            Map response = restTemplate.postForObject(url, request, Map.class);
//
//            if (response == null) {
//                throw new RuntimeException("OpenAI 응답이 null 입니다.");
//            }
//
//            Object dataObj = response.get("data");
//            if (!(dataObj instanceof java.util.List) || ((java.util.List<?>) dataObj).isEmpty()) {
//                throw new RuntimeException("OpenAI 응답에 data 필드가 없거나 비어 있습니다: " + response);
//            }
//
//            Map first = (Map) ((java.util.List<?>) dataObj).get(0);
//            Object urlObj = first.get("url");
//            if (urlObj == null) {
//                throw new RuntimeException("OpenAI 응답에 url 필드가 없습니다: " + first);
//            }
//
//            return urlObj.toString();
//
//        } catch (org.springframework.web.client.HttpClientErrorException e) {
//            // 👇 여기 로그 보고 진짜 원인 확인
//            System.out.println("=== OpenAI 4xx 오류 ===");
//            System.out.println("Status: " + e.getStatusCode());
//            System.out.println("Body  : " + e.getResponseBodyAsString());
//            throw new RuntimeException("OpenAI 4xx 오류", e);
//
//        } catch (org.springframework.web.client.HttpServerErrorException e) {
//            System.out.println("=== OpenAI 5xx 오류 ===");
//            System.out.println("Status: " + e.getStatusCode());
//            System.out.println("Body  : " + e.getResponseBodyAsString());
//            throw new RuntimeException("OpenAI 5xx 오류", e);
//        }
//    }
//}

//테스트용(stability.ai의 무료 api 키 사용)
package com.kt.library.service.impl;

import com.kt.library.service.OpenAiImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OpenAiImageServiceImpl implements OpenAiImageService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateImage(String prompt, String apiKey) {

        // ⭐ Stability 무료 계정에서 사용 가능한 엔진(SDXL)
        String url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

        // ---- 헤더 설정 ----
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));  // ⭐ Accept 문제 해결

        // ---- 요청 바디 ----
        Map<String, Object> body = new HashMap<>();
        body.put("text_prompts", List.of(
                Map.of("text", prompt)
        ));

        // ⭐ SDXL은 1024x1024 해상도를 사용해야 함
        body.put("height", 1024);
        body.put("width", 1024);
        body.put("cfg_scale", 7);
        body.put("samples", 1);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            System.out.println("===== Stability API 요청 시작 =====");
            System.out.println("Prompt: " + prompt);

            Map response = restTemplate.postForObject(url, entity, Map.class);

            System.out.println("===== Stability API 응답 =====");
            System.out.println(response);

            // ---- null 체크 ----
            if (response == null) {
                throw new RuntimeException("Stability API 응답이 null입니다.");
            }

            // ---- artifacts 검사 ----
            Object artifactsObj = response.get("artifacts");
            if (!(artifactsObj instanceof List) || ((List<?>) artifactsObj).isEmpty()) {
                throw new RuntimeException("artifacts가 비어있거나 존재하지 않습니다: " + response);
            }

            Map artifact = (Map) ((List<?>) artifactsObj).get(0);

            // ---- base64 / b64_json 자동 탐색 ----
            String base64 = null;
            if (artifact.containsKey("base64")) {
                base64 = (String) artifact.get("base64");
            } else if (artifact.containsKey("b64_json")) {
                base64 = (String) artifact.get("b64_json");
            }

            if (base64 == null) {
                throw new RuntimeException("base64 또는 b64_json 필드가 없습니다: " + artifact);
            }

            // ---- 프론트에서 즉시 사용 가능한 data:image 형태 반환 ----
            return "data:image/png;base64," + base64;

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.out.println("===== Stability API ERROR (HTTP) =====");
            System.out.println(e.getResponseBodyAsString());
            e.printStackTrace();
            throw new RuntimeException(
                    "Stable Diffusion API 오류: " +
                            e.getStatusCode() + " | " +
                            e.getResponseBodyAsString()
            );

        } catch (Exception e) {
            System.out.println("===== Stability API ERROR (기타) =====");
            e.printStackTrace();
            throw new RuntimeException("Stable Diffusion 이미지 생성 실패: " + e.getMessage());
        }
    }
}
