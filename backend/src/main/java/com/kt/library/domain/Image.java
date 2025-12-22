//package com.kt.library.domain;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "IMAGE")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//
//public class Image {
//    // 기본키 (PK)
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "IMAGE_ID")
//    private Long id;
//
//    // 이미지 주소
//    @Column(name = "IMAGE_URL", nullable = false)
//    private String imageUrl;
//
//}
//


package com.kt.library.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "IMAGE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Image {
    // 기본키 (PK)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IMAGE_ID")
    private Long id;

    // 이미지 주소 (수정된 부분! ⭐)
    // Base64 이미지는 길이가 매우 길기 때문에 LONGTEXT로 설정해야 합니다.
    @Column(name = "IMAGE_URL", nullable = false, columnDefinition = "LONGTEXT")
    private String imageUrl;

}