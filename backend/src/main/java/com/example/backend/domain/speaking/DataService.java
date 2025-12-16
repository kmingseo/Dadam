package com.example.backend.domain.speaking;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DataService {

    private static final String IMAGE_BASE_PATH = "/images";

    private final List<String> consonants = Arrays.asList("ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ");
    private final List<String> vowels = Arrays.asList("ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ");
    private final List<String> syllables = Arrays.asList("가", "나", "다", "라", "마");

    private final List<Word> words = Arrays.asList(
            // 사과 (Apple)
            new Word(10L, "사과", IMAGE_BASE_PATH + "/apple.png", "ko"),
            new Word(11L, "りんご", IMAGE_BASE_PATH + "/apple.png", "ja"),
            new Word(12L, "苹果", IMAGE_BASE_PATH + "/apple.png", "zh"),
            new Word(13L, "apple", IMAGE_BASE_PATH + "/apple.png", "en"),
            new Word(14L, "táo", IMAGE_BASE_PATH + "/apple.png", "vi"),

            // 사탕 (Candy)
            new Word(20L, "사탕", IMAGE_BASE_PATH + "/candy.png", "ko"),
            new Word(21L, "あめ", IMAGE_BASE_PATH + "/candy.png", "ja"),
            new Word(22L, "糖果", IMAGE_BASE_PATH + "/candy.png", "zh"),
            new Word(23L, "candy", IMAGE_BASE_PATH + "/candy.png", "en"),
            new Word(24L, "kẹo", IMAGE_BASE_PATH + "/candy.png", "vi"),

            // 나무 (Tree)
            new Word(30L, "나무", IMAGE_BASE_PATH + "/tree.png", "ko"),
            new Word(31L, "き", IMAGE_BASE_PATH + "/tree.png", "ja"),
            new Word(32L, "树", IMAGE_BASE_PATH + "/tree.png", "zh"),
            new Word(33L, "tree", IMAGE_BASE_PATH + "/tree.png", "en"),
            new Word(34L, "cây", IMAGE_BASE_PATH + "/tree.png", "vi"),

            // 사자 (Lion)
            new Word(40L, "사자", IMAGE_BASE_PATH + "/lion.png", "ko"),
            new Word(41L, "ライオン", IMAGE_BASE_PATH + "/lion.png", "ja"),
            new Word(42L, "狮子", IMAGE_BASE_PATH + "/lion.png", "zh"),
            new Word(43L, "lion", IMAGE_BASE_PATH + "/lion.png", "en"),
            new Word(44L, "sư tử", IMAGE_BASE_PATH + "/lion.png", "vi"),

            // 책 (Book)
            new Word(50L, "책", IMAGE_BASE_PATH + "/book.png", "ko"),
            new Word(51L, "ほん", IMAGE_BASE_PATH + "/book.png", "ja"),
            new Word(52L, "书", IMAGE_BASE_PATH + "/book.png", "zh"),
            new Word(53L, "book", IMAGE_BASE_PATH + "/book.png", "en"),
            new Word(54L, "sách", IMAGE_BASE_PATH + "/book.png", "vi")
    );
    // =================================================================

    private final List<Sentence> sentences = Arrays.asList(
            new Sentence(1L, "사과를 먹어요", "ko")
    );

    // ======= Word 리스트 반환 메서드 (기존 유지) =======
    public List<Word> getConsonants() {
        List<Word> list = new ArrayList<>();
        int id = 1;
        for (String c : consonants) {
            list.add(new Word((long) id++, c, "", "ko"));
        }
        return list;
    }

    public List<Word> getVowels() {
        List<Word> list = new ArrayList<>();
        int id = 100;
        for (String v : vowels) {
            list.add(new Word((long) id++, v, "", "ko"));
        }
        return list;
    }

    public List<Word> getSyllables() {
        List<Word> list = new ArrayList<>();
        int id = 200;
        for (String s : syllables) {
            list.add(new Word((long) id++, s, "", "ko"));
        }
        return list;
    }

    public List<Word> getAllWords() { return words; }
    public List<Sentence> getAllSentences() { return sentences; }
}