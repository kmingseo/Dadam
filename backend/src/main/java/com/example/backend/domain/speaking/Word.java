package com.example.backend.domain.speaking;



public class Word {
    private final Long id;
    private final String targetWord; // 한국어 단어 (예: "사과")
    private final String imageUrl; // 이미지 URL (현재는 임시 URL 사용)
    private final String languageCode; // 언어 코드 (예: "ko")

    public Word(Long id, String targetWord, String imageUrl, String languageCode) {
        this.id = id;
        this.targetWord = targetWord;
        this.imageUrl = imageUrl;
        this.languageCode = languageCode;
    }

    // Getters
    public Long getId() { return id; }
    public String getTargetWord() { return targetWord; }
    public String getImageUrl() { return imageUrl; }
    public String getLanguageCode() { return languageCode; }
}
