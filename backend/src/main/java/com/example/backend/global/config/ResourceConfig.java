package com.example.backend.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.slf4j.Logger; // Logger 클래스 import
import org.slf4j.LoggerFactory; // LoggerFactory 클래스 import

@Configuration
public class ResourceConfig implements WebMvcConfigurer {

    // 1. 로거(Logger) 선언
    private static final Logger log = LoggerFactory.getLogger(ResourceConfig.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 2. 설정이 로드될 때 로그 메시지 출력
        log.info(">>>> Resource Handler Configuration Loaded: Mapping /images/** to classpath:/images/");

        // "/images/**" URL 패턴으로 요청이 들어오면
        // "classpath:/images/" (즉, src/main/resources/images/) 폴더에서 파일을 찾도록 매핑합니다.
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/images/");
    }
}
