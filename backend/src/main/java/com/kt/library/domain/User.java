package com.kt.library.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "USERS")

public class User {
    // 기본키 (PK)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Long id;

    // User 이름 (NOT NULL)
    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    // Email 주소 (NOT NULL)
    @Column(name = "EMAIL", nullable = false, length = 100, unique = true)
    private String email;

    // 아이디
    @Column(name = "ID", nullable = false, unique = true, length = 50)
    private String loginId;

    // 패스워드
    @Column(name = "PASSWORD", nullable = false, length = 100)
    private String password;

    // USER 1 : BOOK N
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference

    private java.util.List<Book> books = new java.util.ArrayList<>();

}
