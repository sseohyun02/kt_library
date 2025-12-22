////package com.kt.library.service.impl;
////
////import com.kt.library.service.OpenAiImageService;
////import lombok.RequiredArgsConstructor;
////import org.springframework.beans.factory.annotation.Value;
////import org.springframework.stereotype.Service;
////import org.springframework.web.client.RestTemplate;
////import org.springframework.http.*;
////
////import java.util.HashMap;
////import java.util.Map;
////
////@Service
////@RequiredArgsConstructor
////public class OpenAiImageServiceImpl implements OpenAiImageService {
////
////    private final RestTemplate restTemplate = new RestTemplate();
////
////    @Override
////    public String generateImage(String prompt, String apiKey) {
////
////        String url = "https://api.openai.com/v1/images/generations";
////
////        // 헤더 설정
////        HttpHeaders headers = new HttpHeaders();
////        headers.setContentType(MediaType.APPLICATION_JSON);
////        headers.setBearerAuth(apiKey);
////
////        // 바디 설정
////        Map<String, Object> requestBody = new HashMap<>();
////        requestBody.put("model", "dall-e-3");
////        requestBody.put("prompt", prompt);
////        requestBody.put("size", "1024x1024");
////
////        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
////
////        try {
////            // 요청 보내기
////            Map response = restTemplate.postForObject(url, request, Map.class);
////
////            if (response == null) {
////                throw new RuntimeException("OpenAI 응답이 null 입니다.");
////            }
////
////            Object dataObj = response.get("data");
////            if (!(dataObj instanceof java.util.List) || ((java.util.List<?>) dataObj).isEmpty()) {
////                throw new RuntimeException("OpenAI 응답에 data 필드가 없거나 비어 있습니다: " + response);
////            }
////
////            Map first = (Map) ((java.util.List<?>) dataObj).get(0);
////            Object urlObj = first.get("url");
////            if (urlObj == null) {
////                throw new RuntimeException("OpenAI 응답에 url 필드가 없습니다: " + first);
////            }
////
////            return urlObj.toString();
////
////        } catch (org.springframework.web.client.HttpClientErrorException e) {
////            // 👇 여기 로그 보고 진짜 원인 확인
////            System.out.println("=== OpenAI 4xx 오류 ===");
////            System.out.println("Status: " + e.getStatusCode());
////            System.out.println("Body  : " + e.getResponseBodyAsString());
////            throw new RuntimeException("OpenAI 4xx 오류", e);
////
////        } catch (org.springframework.web.client.HttpServerErrorException e) {
////            System.out.println("=== OpenAI 5xx 오류 ===");
////            System.out.println("Status: " + e.getStatusCode());
////            System.out.println("Body  : " + e.getResponseBodyAsString());
////            throw new RuntimeException("OpenAI 5xx 오류", e);
////        }
////    }
////}
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

        // 1. [핵심] AWS에서 오류 안 나게 길이 강제 조절
        // Stability AI는 긴 한글 프롬프트를 잘 이해 못하거나 오류를 뱉습니다.
        // 안전하게 100자 이내로 자르고, 뒤에 스타일 키워드를 붙여주는 게 훨씬 잘 나옵니다.
        String finalPrompt = makeSafePrompt(prompt);

        String url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = new HashMap<>();

        // 2. 프롬프트 설정
        body.put("text_prompts", List.of(
                Map.of(
                        "text", finalPrompt,
                        "weight", 1
                )
        ));

        // 3. 스타일 및 설정 (오류 방지용 기본값)
        body.put("style_preset", "fantasy-art"); // 책 표지에 어울리는 스타일
        body.put("height", 1024);
        body.put("width", 1024);
        body.put("cfg_scale", 7);
        body.put("samples", 1);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            // AWS 로그용 출력 (nohup.out에서 확인 가능)
            System.out.println(">>> [AWS 이미지 요청] 원본: " + prompt);
            System.out.println(">>> [AWS 이미지 요청] 수정됨: " + finalPrompt);

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
            // 4. [중요] AWS에서 400 Bad Request가 뜨면 이유를 로그에 찍어야 함
            System.out.println("!!! [AWS 에러] 상태 코드: " + e.getStatusCode());
            System.out.println("!!! [AWS 에러] 내용: " + e.getResponseBodyAsString());

            // 사용자에게는 너무 긴 메시지 대신 간단한 에러 반환
            throw new RuntimeException("이미지 생성 실패(API 오류): " + e.getStatusCode());

        } catch (Exception e) {
            System.out.println("!!! [AWS 에러] 시스템 오류: " + e.getMessage());
            throw new RuntimeException("이미지 생성 중 오류 발생");
        }
    }

    // ✂️ 프롬프트 안전하게 자르는 함수
    private String makeSafePrompt(String original) {
        if (original == null || original.isEmpty()) {
            return "A mysterious book cover, fantasy style, high quality";
        }

        // 1. 줄바꿈 문자 제거 (JSON 에러 원인)
        String clean = original.replace("\n", " ").replace("\r", " ");

        // 2. 길이 제한 (한글 50~100자 넘어가면 토큰 꼬임 방지)
        int safeLength = 100;
        if (clean.length() > safeLength) {
            clean = clean.substring(0, safeLength);
        }

        // 3. 보정 키워드 추가 (한글만 보내면 퀄리티가 낮음 -> 영어 키워드 추가)
        return clean + ", best quality, book cover, 8k resolution, detailed";
    }
}