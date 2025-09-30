package com.example.backend.domain.listening.dictation;

import com.example.backend.domain.listening.dictation.dto.Dictation;
import com.example.backend.domain.listening.dictation.dto.DictationCheckRequest;
import com.example.backend.domain.listening.dictation.dto.DictationSubmitResponse;
import com.example.backend.domain.listening.trans.TranslationService;
import com.example.backend.domain.sentence.Sentence;
import com.example.backend.domain.sentence.SentenceRepository;
import com.example.backend.domain.user.UserDetailsImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DictationService {

    private final SentenceRepository sentenceRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final long TTL_SECONDS = 1800;
    private final TranslationService translationService;

    //문제 만들기
    public List<Dictation> createProblems() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userLang = userDetails.getUser().getNativeLanguage();

        List<Sentence> sentences= sentenceRepository.findRandomSentenceBodies(5);

        List<String> texts = sentences.stream()
                .map(Sentence::getBody)
                .toList();

        List<String> translations = translationService.translate(texts, userLang);

        List<Dictation> dictations = new ArrayList<>();
        for(int i = 0; i < sentences.size(); i++) {
            Sentence sentence = sentences.get(i);
            String translated = translations.get(i);
            dictations.add(new Dictation(sentence.getId(), sentence.getBody(), translated));
        }

        return dictations;
    }

    //하나로 묶어서 반환
    public String createProblemSet() {
        try{
            List<Dictation> problems = createProblems();

            String problemSetId = UUID.randomUUID().toString();

            String json = objectMapper.writeValueAsString(problems);
            redisTemplate.opsForValue().set(problemSetId, json, TTL_SECONDS, TimeUnit.SECONDS);
            return problemSetId;
        } catch (JsonProcessingException e){
            throw new RuntimeException(e);
        }
    }

    public Dictation getDictation(String problemSetId, int problemIndex) {
        try{
            String json = redisTemplate.opsForValue().get(problemSetId);
            if( json == null ) throw new RuntimeException("해당 id의 문제를 찾을 수 없습니다.");


            List<Dictation> dictations = objectMapper.readValue(json, new TypeReference<List<Dictation>>() {});

            if(problemIndex < 0 || problemIndex>= dictations.size()) throw new IllegalArgumentException("유효하지 않은 인덱스입니다.");

            return dictations.get(problemIndex);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 파싱 실패", e);
        }
    }

    public DictationSubmitResponse checkAnswer(DictationCheckRequest checkRequest) {
        try {
            String json = redisTemplate.opsForValue().get(checkRequest.getProblemSetId());
            if (json == null) throw new RuntimeException("해당 id의 문제를 찾을 수 없습니다.");

            List<Dictation> dictations = objectMapper.readValue(json, new TypeReference<List<Dictation>>() {});
            int index = checkRequest.getProblemIndex();
            if (index < 0 || index >= dictations.size()) throw new IllegalArgumentException("유효하지 않은 문제 인덱스입니다.");

            Dictation dictation = dictations.get(index);

            return createResponse(dictation.getBody(), checkRequest.getUserAnswer());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private DictationSubmitResponse createResponse(String answer, String userAnswer) {
        String normalizedAnswer = normalize(answer);
        String normalizedUser = normalize(userAnswer);

        boolean isCorrect = normalizedAnswer.equals(normalizedUser);

        DictationSubmitResponse response = new DictationSubmitResponse();
        response.setCorrect(isCorrect);
        response.setUserAnswer(normalizedUser);
        response.setAnswer(normalizedAnswer);
        return response;
    }

    private String normalize(String text) {
        return text.replaceAll("\\\\n", " ")
                .replaceAll("\\n", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }


}
