package com.example.backend.domain.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String userId;
    private String username;
    private String password;
    private String email;
    private String nativeLanguage;
}