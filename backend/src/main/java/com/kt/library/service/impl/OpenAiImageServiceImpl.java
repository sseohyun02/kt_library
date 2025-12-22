/// /package com.kt.library.service.impl;
/// /
/// /import com.kt.library.service.OpenAiImageService;
/// /import lombok.RequiredArgsConstructor;
/// /import org.springframework.beans.factory.annotation.Value;
/// /import org.springframework.stereotype.Service;
/// /import org.springframework.web.client.RestTemplate;
/// /import org.springframework.http.*;
/// /
/// /import java.util.HashMap;
/// /import java.util.Map;
/// /
/// /@Service
/// /@RequiredArgsConstructor
/// /public class OpenAiImageServiceImpl implements OpenAiImageService {
/// /
/// /    private final RestTemplate restTemplate = new RestTemplate();
/// /
/// /    @Override
/// /    public String generateImage(String prompt, String apiKey) {
/// /
/// /        String url = "https://api.openai.com/v1/images/generations";
/// /
/// /        // 헤더 설정
/// /        HttpHeaders headers = new HttpHeaders();
/// /        headers.setContentType(MediaType.APPLICATION_JSON);
/// /        headers.setBearerAuth(apiKey);
/// /
/// /        // 바디 설정
/// /        Map<String, Object> requestBody = new HashMap<>();
/// /        requestBody.put("model", "dall-e-3");
/// /        requestBody.put("prompt", prompt);
/// /        requestBody.put("size", "1024x1024");
/// /
/// /        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
/// /
/// /        try {
/// /            // 요청 보내기
/// /            Map response = restTemplate.postForObject(url, request, Map.class);
/// /
/// /            if (response == null) {
/// /                throw new RuntimeException("OpenAI 응답이 null 입니다.");
/// /            }
/// /
/// /            Object dataObj = response.get("data");
/// /            if (!(dataObj instanceof java.util.List) || ((java.util.List<?>) dataObj).isEmpty()) {
/// /                throw new RuntimeException("OpenAI 응답에 data 필드가 없거나 비어 있습니다: " + response);
/// /            }
/// /
/// /            Map first = (Map) ((java.util.List<?>) dataObj).get(0);
/// /            Object urlObj = first.get("url");
/// /            if (urlObj == null) {
/// /                throw new RuntimeException("OpenAI 응답에 url 필드가 없습니다: " + first);
/// /            }
/// /
/// /            return urlObj.toString();
/// /
/// /        } catch (org.springframework.web.client.HttpClientErrorException e) {
/// /            // 👇 여기 로그 보고 진짜 원인 확인
/// /            System.out.println("=== OpenAI 4xx 오류 ===");
/// /            System.out.println("Status: " + e.getStatusCode());
/// /            System.out.println("Body  : " + e.getResponseBodyAsString());
/// /            throw new RuntimeException("OpenAI 4xx 오류", e);
/// /
/// /        } catch (org.springframework.web.client.HttpServerErrorException e) {
/// /            System.out.println("=== OpenAI 5xx 오류 ===");
/// /            System.out.println("Status: " + e.getStatusCode());
/// /            System.out.println("Body  : " + e.getResponseBodyAsString());
/// /            throw new RuntimeException("OpenAI 5xx 오류", e);
/// /        }
/// /    }
/// /}
//
////테스트용(stability.ai의 무료 api 키 사용)
//package com.kt.library.service.impl;
//
//import com.kt.library.service.OpenAiImageService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.HttpClientErrorException;
//import org.springframework.web.client.HttpServerErrorException;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.*;
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
//        // ⭐ Stability 무료 계정에서 사용 가능한 엔진(SDXL)
//        String url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";
//
//        // ---- 헤더 설정 ----
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + apiKey);
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.setAccept(List.of(MediaType.APPLICATION_JSON));  // ⭐ Accept 문제 해결
//
//        // ---- 요청 바디 ----
//        Map<String, Object> body = new HashMap<>();
//        body.put("text_prompts", List.of(
//                Map.of("text", prompt)
//        ));
//
//        // ⭐ SDXL은 1024x1024 해상도를 사용해야 함
//        body.put("height", 1024);
//        body.put("width", 1024);
//        body.put("cfg_scale", 7);
//        body.put("samples", 1);
//
//        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
//
//        try {
//            System.out.println("===== Stability API 요청 시작 =====");
//            System.out.println("Prompt: " + prompt);
//
//            Map response = restTemplate.postForObject(url, entity, Map.class);
//
//            System.out.println("===== Stability API 응답 =====");
//            System.out.println(response);
//
//            // ---- null 체크 ----
//            if (response == null) {
//                throw new RuntimeException("Stability API 응답이 null입니다.");
//            }
//
//            // ---- artifacts 검사 ----
//            Object artifactsObj = response.get("artifacts");
//            if (!(artifactsObj instanceof List) || ((List<?>) artifactsObj).isEmpty()) {
//                throw new RuntimeException("artifacts가 비어있거나 존재하지 않습니다: " + response);
//            }
//
//            Map artifact = (Map) ((List<?>) artifactsObj).get(0);
//
//            // ---- base64 / b64_json 자동 탐색 ----
//            String base64 = null;
//            if (artifact.containsKey("base64")) {
//                base64 = (String) artifact.get("base64");
//            } else if (artifact.containsKey("b64_json")) {
//                base64 = (String) artifact.get("b64_json");
//            }
//
//            if (base64 == null) {
//                throw new RuntimeException("base64 또는 b64_json 필드가 없습니다: " + artifact);
//            }
//
//            // ---- 프론트에서 즉시 사용 가능한 data:image 형태 반환 ----
//            return "data:image/png;base64," + base64;
//
//        } catch (HttpClientErrorException | HttpServerErrorException e) {
//            System.out.println("===== Stability API ERROR (HTTP) =====");
//            System.out.println(e.getResponseBodyAsString());
//            e.printStackTrace();
//            throw new RuntimeException(
//                    "Stable Diffusion API 오류: " +
//                            e.getStatusCode() + " | " +
//                            e.getResponseBodyAsString()
//            );
//
//        } catch (Exception e) {
//            System.out.println("===== Stability API ERROR (기타) =====");
//            e.printStackTrace();
//            throw new RuntimeException("Stable Diffusion 이미지 생성 실패: " + e.getMessage());
//        }
//    }
//}

package com.kt.library.service.impl;

import com.kt.library.service.OpenAiImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAiImageServiceImpl implements OpenAiImageService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateImage(String content, String apiKey) {

        // 1. [번역 단계] 한글/중국어/영어 상관없이 영어 프롬프트로 변환
        String englishPrompt = translateToEnglish(content);
        log.info(">>> 번역/가공된 프롬프트: {}", englishPrompt);

        // 2. Stability AI 호출 (번역된 프롬프트 사용)
        return callStabilityAi(englishPrompt, apiKey);
    }

    // ★ 텍스트를 영어 프롬프트로 변환하는 메서드
    private String translateToEnglish(String originalText) {
        if (originalText == null || originalText.isEmpty()) {
            return "A mysterious book cover, fantasy style";
        }

        // [STEP 1] 실제 번역 API가 있다면 여기서 호출 (예: Google Translate, GPT)
        // String translated = googleTranslateService.translate(originalText);
        // return translated + ", book cover style, 8k";

        // [STEP 2] API가 없을 때의 대체 로직 (현재 적용됨)
        // 한글/중국어가 그대로 들어가도 그림이 나오도록 '강력한 영어 스타일 태그'를 뒤에 붙입니다.

        // 줄바꿈 제거
        String cleanText = originalText.replace("\n", " ").replace("\r", " ");

        // 길이 제한 (Stability AI는 너무 긴 텍스트를 싫어함)
        if (cleanText.length() > 100) {
            cleanText = cleanText.substring(0, 100);
        }

        // ★ 비영어권 텍스트 뒤에 영어 키워드를 붙여서 AI가 "책 표지"임을 인식하게 함
        return cleanText + ", (book cover), (best quality), fantasy art style, highly detailed, 8k resolution, cinematic lighting";
    }

    // Stability AI API 호출 로직
    private String callStabilityAi(String prompt, String apiKey) {
        String url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = new HashMap<>();
        body.put("text_prompts", List.of(
                Map.of("text", prompt, "weight", 1)
        ));
        body.put("style_preset", "fantasy-art");
        body.put("height", 1024);
        body.put("width", 1024);
        body.put("cfg_scale", 7);
        body.put("samples", 1);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            Map response = restTemplate.postForObject(url, entity, Map.class);

            if (response == null) throw new RuntimeException("응답이 비어있습니다.");

            Object artifactsObj = response.get("artifacts");
            if (!(artifactsObj instanceof List) || ((List<?>) artifactsObj).isEmpty()) {
                throw new RuntimeException("이미지 데이터가 없습니다.");
            }

            Map artifact = (Map) ((List<?>) artifactsObj).get(0);
            String base64 = (String) artifact.get("base64");

            return "data:image/png;base64," + base64;

        } catch (HttpClientErrorException e) {
            log.error("Stability AI API 오류: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("이미지 생성 API 오류: " + e.getStatusCode());
        } catch (Exception e) {
            log.error("이미지 생성 중 알 수 없는 오류", e);
            throw new RuntimeException("이미지 생성 시스템 오류");
        }
    }
}