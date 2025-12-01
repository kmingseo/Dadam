package com.example.backend.domain.speaking;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DataController {

    private final DataService dataService;

    public DataController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping("/consonants")
    public List<Word> getConsonants() {
        return dataService.getConsonants();
    }

    @GetMapping("/vowels")
    public List<Word> getVowels() {
        return dataService.getVowels();
    }

    @GetMapping("/syllables")
    public List<Word> getSyllables() {
        return dataService.getSyllables();
    }

    @GetMapping("/words")
    public List<Word> getWords() {
        return dataService.getAllWords();
    }

    @GetMapping("/sentences")
    public List<Sentence> getSentences() {
        return dataService.getAllSentences();
    }
}
