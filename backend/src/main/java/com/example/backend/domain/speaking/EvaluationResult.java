package com.example.backend.domain.speaking; // ⭐️ SpeakingController와 동일해야 합니다.

// API 응답 구조를 정의하는 클래스 (DTO)
public class EvaluationResult {
    private final String transcribedText; // Whisper가 인식한 텍스트
    private final long score;             // 최종 발음 점수 (0-100)

    public EvaluationResult(String transcribedText, long score) {
        this.transcribedText = transcribedText;
        this.score = score;
    }

    // Getters (JSON 직렬화를 위해 필수)
    public String getTranscribedText() {
        return transcribedText;
    }

    public long getScore() {
        return score;
    }
}