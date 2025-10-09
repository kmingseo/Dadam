package com.example.backend.domain.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenRequest {
    private String refreshToken;
}
