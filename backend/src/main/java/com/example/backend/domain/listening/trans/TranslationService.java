package com.example.backend.domain.listening.trans;

import com.example.backend.domain.listening.cardSelect.dto.Card;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.translate.v3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TranslationService {

    private final TranslationServiceClient client;

    @Value("${google.project-id}")
    private String projectId;

    @Value("${google.location}")
    private String location;

    public TranslationService() throws Exception {

        InputStream keyStream = new ClassPathResource("google-service-account.json").getInputStream();
        GoogleCredentials credentials = GoogleCredentials.fromStream(keyStream)
                .createScoped("https://www.googleapis.com/auth/cloud-platform");

        TranslationServiceSettings settings = TranslationServiceSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();
        this.client = TranslationServiceClient.create(settings);
    }

    public List<String> translate(List<String> texts, String targetLanguage) {
        try {
            TranslateTextRequest request = TranslateTextRequest.newBuilder()
                    .setParent(LocationName.of(projectId, location).toString())
                    .addAllContents(texts)
                    .setMimeType("text/plain")
                    .setSourceLanguageCode("ko")
                    .setTargetLanguageCode(targetLanguage)
                    .build();

            TranslateTextResponse response = client.translateText(request);

            return response.getTranslationsList().stream()
                    .map(Translation::getTranslatedText)
                    .toList();

        } catch (Exception e) {
            throw new RuntimeException("번역 실패", e);
        }
    }

}