package com.example.backend.domain.listening.dictation;

import com.example.backend.domain.listening.dictation.dto.Dictation;
import com.example.backend.domain.sentence.SentenceRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

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

    //문제 만들기
    public List<Dictation> createProblems() {
        List<String> bodies= sentenceRepository.findRandomSentenceBodies(5);
        return bodies.stream().map(Dictation::new).collect(Collectors.toList());
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

}
