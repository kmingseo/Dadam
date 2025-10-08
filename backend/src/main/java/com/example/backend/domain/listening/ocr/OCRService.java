package com.example.backend.domain.listening.ocr;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import jakarta.annotation.PreDestroy;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class OCRService {
    private final ImageAnnotatorClient visionClient;

    public OCRService() throws Exception {
        InputStream keyStream = new ClassPathResource("google-service-account.json").getInputStream();
        GoogleCredentials credentials = GoogleCredentials.fromStream(keyStream)
                .createScoped("https://www.googleapis.com/auth/cloud-platform");

        ImageAnnotatorSettings settings = ImageAnnotatorSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();

        this.visionClient = ImageAnnotatorClient.create(settings);
    }

    public String detectText(byte[] imageBytes) throws Exception {
        ByteString imgBytes = ByteString.copyFrom(imageBytes);
        Image img = Image.newBuilder().setContent(imgBytes).build();

        Feature feat = Feature.newBuilder().setType(Feature.Type.DOCUMENT_TEXT_DETECTION).build();

        AnnotateImageRequest request =
                AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();

        List<AnnotateImageResponse> responses = visionClient.batchAnnotateImages(List.of(request)).getResponsesList();

        if (responses.isEmpty() || responses.get(0).hasError()) {
            throw new RuntimeException("Error during text detection: " +
                    (responses.isEmpty() ? "No response" : responses.get(0).getError().getMessage()));
        }

        return responses.get(0).getFullTextAnnotation().getText();
    }

    @PreDestroy
    public void shutdownVisionClient() throws Exception {
        if (visionClient != null) {
            visionClient.shutdown();
            visionClient.awaitTermination(5, TimeUnit.SECONDS);
        }
    }
}
