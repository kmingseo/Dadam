package com.example.backend.domain.speaking;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class WordDataService {
    // 정적 리소스 경로를 사용합니다. (프론트엔드 BASE_URL과 결합되어 사용됨)
    private static final String IMAGE_BASE_PATH = "/images";

    // ⭐️ 테스트용 단어 목록 - 모든 확장자를 .jpg로 변경 ⭐️
    private final List<Word> words = Arrays.asList(
            // --- 사과 (Apple) 개념 ---
            new Word(1L, "사과", IMAGE_BASE_PATH + "/apple.jpg", "ko"),
            new Word(3L, "りんご", IMAGE_BASE_PATH + "/apple.jpg", "ja"),
            new Word(5L, "苹果", IMAGE_BASE_PATH + "/apple.jpg", "zh"),
            new Word(7L, "táo", IMAGE_BASE_PATH + "/apple.jpg", "vi"),

            // --- 바나나 (Banana) 개념 ---
            new Word(2L, "바나나", IMAGE_BASE_PATH + "/banana.jpg", "ko"),
            new Word(4L, "バナナ", IMAGE_BASE_PATH + "/banana.jpg", "ja"),
            new Word(6L, "香蕉", IMAGE_BASE_PATH + "/banana.jpg", "zh"),
            new Word(8L, "chuối", IMAGE_BASE_PATH + "/banana.jpg", "vi"),

            // --- 물 (Water) 개념 ---
            new Word(9L, "물", IMAGE_BASE_PATH + "/water.jpg", "ko"),
            new Word(11L, "みず", IMAGE_BASE_PATH + "/water.jpg", "ja"),
            new Word(13L, "水", IMAGE_BASE_PATH + "/water.jpg", "zh"),
            new Word(15L, "nước", IMAGE_BASE_PATH + "/water.jpg", "vi"),

            // --- 강아지 (Dog) 개념 ---
            new Word(10L, "강아지", IMAGE_BASE_PATH + "/dog.jpg", "ko"),
            new Word(12L, "いぬ", IMAGE_BASE_PATH + "/dog.jpg", "ja"),
            new Word(14L, "狗", IMAGE_BASE_PATH + "/dog.jpg", "zh"),
            new Word(16L, "chó", IMAGE_BASE_PATH + "/dog.jpg", "vi")
    );

    public Optional<Word> getWordById(Long id) {
        return words.stream()
                .filter(word -> word.getId().equals(id))
                .findFirst();
    }

    /**
     * 현재 설정된 모든 단어 목록을 반환합니다.
     */
    public List<Word> getAllWords() {
        return words;
    }
}
