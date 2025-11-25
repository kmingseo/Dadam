package com.example.backend.domain.speaking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart; // ⭐️ RequestPart import 추가
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api")
public class SpeakingController {

    private final WhisperService whisperService; // ⭐️ WhisperService로 변경

    // 의존성 주입 (Dependency Injection)
    public SpeakingController(WhisperService whisperService) { // ⭐️ WhisperService로 변경
        this.whisperService = whisperService;
    }

    @PostMapping("/evaluate-speech")
    public ResponseEntity<Object> evaluateSpeech(
            @RequestPart("audio") MultipartFile audioFile,
            @RequestParam("word") String targetWord) {

        if (audioFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Audio file is empty.");
        }

        File tempFile = null;

        try {
            // 1. 임시 파일로 저장
            tempFile = File.createTempFile("audio-", ".m4a"); // .m4a는 클라이언트 형식에 맞게 유지
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(audioFile.getBytes());
            }

            // 2. Whisper 호출 (Python 스크립트 실행)
            String transcribedText = whisperService.transcribeAudio(tempFile);

            // 3. 발음 평가 (Levenshtein 거리 계산 로직 복구)
            int distance = calculateLevenshteinDistance(transcribedText, targetWord);

            // 점수 계산 로직 복구
            int maxLength = Math.max(targetWord.length(), transcribedText.trim().replaceAll("\\s+", "").length());
            double score = maxLength == 0 ? 0 : 100.0 - (100.0 * (double)distance / maxLength);

            // 4. 결과 반환
            EvaluationResult result = new EvaluationResult(transcribedText, Math.round(score));
            return ResponseEntity.ok(result);

        } catch (IOException e) {
            System.err.println("File I/O Error: " + e.getMessage());
            return ResponseEntity.status(500).body("File processing error: " + e.getMessage());
        } catch (Exception e) {
            // Python 실행 실패, Whisper 라이브러리 오류 등
            System.err.println("Whisper/Service Error: " + e.getMessage());
            return ResponseEntity.status(500).body("Whisper Service Failed: " + e.getMessage());
        } finally {
            // 임시 파일 삭제
            if (tempFile != null && tempFile.exists()) {
                if (!tempFile.delete()) {
                    System.err.println("Warning: Failed to delete temporary file: " + tempFile.getAbsolutePath());
                }
            }
        }
    }

    private int calculateLevenshteinDistance(String s1, String s2) {
        String str1 = s1.trim().toLowerCase().replaceAll("\\s+", ""); // 공백 제거 추가
        String str2 = s2.trim().toLowerCase().replaceAll("\\s+", ""); // 공백 제거 추가

        int n = str1.length();
        int m = str2.length();
        // ... (나머지 Levenshtein 로직은 그대로 유지)
        int[][] dp = new int[n + 1][m + 1];
        // ... (DP 계산 로직)
        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int j = 0; j <= m; j++) dp[0][j] = j;

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                int cost = (str1.charAt(i - 1) == str2.charAt(j - 1)) ? 0 : 1;

                dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,
                        Math.min(dp[i][j - 1] + 1,
                                dp[i - 1][j - 1] + cost)
                );
            }
        }
        return dp[n][m];
    }
}