package com.kt.library.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 현재 동작하지 않음
    // 404 해당 책이나 이미지가 없을 떄
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException e) {
        return createErrorResponse(HttpStatus.NOT_FOUND, e.getMessage());
    }

    // 401 세션 만료 - 로그인 안 한 사람 막기
    @ExceptionHandler(UnAuthorizedException.class)
    public ResponseEntity<Map<String, String>> handleUnAuthorized(UnAuthorizedException e) {
        return createErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    // 400 필수값 누락
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex){
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "요청 값이 올바르지 않습니다.");

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));

        response.put("errors", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // 400 로직 오류 - 비밀번호 불일치, 중복 아이디 등
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    // 현재 동작하지 않음
    // 500 이미지 생성 오류 - 특정 상황
    @ExceptionHandler(ImageGenerationException.class)
    public ResponseEntity<Map<String, String>> handleImageException(ImageGenerationException e) {
        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 생성 중 오류가 발생했습니다.");
    }

    // 500 그 외 모든 서버 에러 - 안전장치
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAllException(Exception e) {
        e.printStackTrace(); // 서버 로그용
        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.");
    }

    // 중복되는 응답코드를 줄이는 메서드
    private ResponseEntity<Map<String, String>> createErrorResponse(HttpStatus status, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }
}
