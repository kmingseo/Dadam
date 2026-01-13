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
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/images/");
    }
}
