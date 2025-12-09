# 📚 KT_Library
KT AivleSchool 9조

---

## 프로젝트 소개
사용자가 작가가 되어 직접 작성한 텍스트를 기반으로 AI가 내용을 분석해 표지 이미지를 자동 생성하며, 다른 사용자들이 등록한 작품을 함께 열람할 수 있는 서비스입니다.

---

## 주요 기능 요구사항

### 1. 도서 목록 확인
현재까지 등록된 도서 목록을 확인한다.
### 2. 신규 도서 등록
직접 도서를 작성해 등록한다.
### 3. 도서 상세 정보 조회
더 알고싶은 도서 내용과 등록일 및 수정일 등을 확인한다.
### 4. 도서 수정 및 삭제
이전에 작성한 도서 내용을 수정한다.
### 5. AI 표지 이미지 생성
등록한 내용에 어울리는 이미지를 ai가 생성한다.

---------------------------------------------------------------------------------------------------
# Backend

## 기술 스택

| 기술 | 버전 | 사용 목적 |
| --- | --- | --- |
| **Java** | 17 | 백엔드 서비스 개발 언어 |
| **Spring Boot** | 3.x | 전체 애플리케이션 프레임워크 |
| **Spring Web** | - | REST API 개발 |
| **Spring Data JPA** | - | ORM 기반 데이터 관리 및 쿼리 자동화 |
| **H2 Database** | 개발용 | 로컬 테스트 및 개발 환경 DB |
| **Lombok** | - | 반복 코드 최소화 (Getter/Setter 등) |
| **MapStruct** | - | DTO ↔ Entity 매핑 자동화 |
| **Spring AOP(Global Exception)** | - | 공통 예외 처리 |
| **Spring Interceptor** | - | 로그인 검증 및 요청 필터링 |
| **Gradle** | - | 빌드 및 의존성 관리 |
| **Postman** | - | API 테스트 |

---

## 예외 처리 구조

### 1. **Global Exception Handler**

- `@RestControllerAdvice` 기반으로 구현
- 컨트롤러 · 서비스 계층에서 발생하는 예외를 한 곳에서 처리
- 공통 에러 응답(JSON) 형식 제공
- 주요 특징:
    - Validation 오류 처리
    - 인증/인가 예외 처리
    - 비즈니스 로직에서 발생하는 커스텀 예외 처리

### 2. **로그인 체크 인터셉터**

- 모든 요청 전 처리 단계에서 동작
- 인증이 필요한 URL을 접근할 때 JWT 또는 세션을 검증하도록 설계 가능
- 현재 구조에서는 “로그인 여부”만 체크하여 비회원 요청 차단
- 인증이 필요한 API 접근 시 HTTP 401 응답 반환

---

## 시스템 아키텍처

### 1. **Controller Layer**

- HTTP 요청을 받아 Service 레이어에 전달하고, 응답을 만들어 반환
- 도메인별 컨트롤러 구성
    - `BookController` : 도서 등록/조회/수정/삭제, 목록 조회
    - `UserController` : 회원가입, 로그인
    - `LikeController` : 도서 좋아요 생성/취소, 좋아요 개수 집계
    - `FavoriteController` : 즐겨찾기 추가/취소, 목록 조회
    - `CommentController` : 댓글 등록/삭제, 목록 조회

### **2. Service Layer**

- 비즈니스 로직 처리
- 트랜잭션 및 도메인 간 조합 로직 수행
- 인터페이스(`BookService`, `UserService`, `LikeService`, `FavoriteService`, `CommentService`) + 구현체(`ServiceImpl`) 구조

### **3. Repository Layer**

- Spring Data JPA를 활용하여 DB 접근
- 각 도메인별 Repository 제공
    - `BookRepository`, `UserRepository`, `LikeRepository`, `FavoriteRepository`, `CommentRepository`

### **4. Domain Layer**

- 엔티티
    - `User`, `Book`, `Like`, `Favorite`, `Comment`, `Image`
- 사용자와 도서 간의 상호작용(좋아요, 즐겨찾기, 댓글)을 중심으로 연관관계 설계

### **5. ERD**

```
User ───< Like >─── Book
User ───< Favorite >─── Book
User ───< Comment >─── Book
Book ─── 1 : N ─── Image
```
# Frontend

## 1. 프로젝트 소개
이 프로젝트는 사용자가 책을 조회하고, 좋아요/찜 기능과 댓글 기능을 이용할 수 있는 웹 서비스입니다.  
프론트엔드는 React 기반으로 개발되었으며, 백엔드(Spring Boot)와 REST API로 통신합니다.

---

## 2. 기술 스택
- **React**
- **Vite / CRA**
- **JavaScript**
- **Material-UI (MUI)**
- **Axios**
- **React Router**

---

## 3. 주요 기능

### 도서 상세 페이지
- 책 이미지, 제목, 저자, 장르 등 상세 정보 표시
- 좋아요 / 찜 버튼 (MUI IconButton 사용)
- 좋아요 수 표시
- 댓글 기능

### 목록 / 검색 기능
- 서버 API 연동하여 책 목록 조회
- 제목 검색 또는 필터 가능
- 좋아요 누른 책의 목록 조회

### 사용자 경험 개선
- 반응형 레이아웃
- MUI 컴포넌트 기반 UI

---

## 4. 폴더 구조
```bash
frontend/
├─ src/
│  ├─ assets/
│  ├─ components/     # 재사용 컴포넌트
│  ├─ data/           # 목업 파일
│  ├─ pages/          # 라우팅되는 페이지
│  ├─ services/       # axios로 API 호출
│  ├─ App.jsx
│  └─ main.jsx
```

---
## 5. API 연동 정보

프론트엔드는 아래 백엔드 API와 통신합니다:

GET /books : 목록 조회

GET /books/{id} : 책 상세 조회

GET /books/my : 내가 업로드한 책만 조회

POST /books/new : 새로운 책 등록

PUT /books/edit/{id} : 책 정보 수정

DELETE /books/{id} : 책 삭제

Axios로 호출하며, services/bookService.js에서 관리합니다.
