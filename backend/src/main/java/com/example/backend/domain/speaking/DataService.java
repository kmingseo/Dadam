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
            new Word(1L, "사과", IMAGE_BASE_PATH + "/apple.jpg", "ko"),
            new Word(2L, "바나나", IMAGE_BASE_PATH + "/banana.jpg", "ko")
    );

    private final List<Sentence> sentences = Arrays.asList(
            new Sentence(1L, "사과를 먹어요", "ko")
    );

    // ======= Word 리스트 반환 메서드 =======
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
