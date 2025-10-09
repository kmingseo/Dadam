package com.example.backend.domain.auth;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final StringRedisTemplate redisTemplate;
    private static final long REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7;

    public void storeRefreshToken(String userId, String refreshToken) {
        redisTemplate.opsForValue().set(userId, refreshToken, REFRESH_TOKEN_TTL, TimeUnit.SECONDS);
    }

    public String getRefreshToken(String userId) {
        return redisTemplate.opsForValue().get(userId);
    }

    public void deleteRefreshToken(String userId) {
        redisTemplate.delete(userId);
    }
}
