package com.example.backend.domain.listening.cardSelect;

import com.example.backend.domain.listening.cardSelect.dto.Card;
import com.example.backend.domain.listening.cardSelect.dto.CardProblem;
import com.example.backend.domain.listening.cardSelect.dto.CardProblemSet;
import com.example.backend.domain.listening.cardSelect.dto.CardSelectRequest;
import com.example.backend.domain.listening.trans.TranslationService;
import com.example.backend.domain.user.UserDetailsImpl;
import com.example.backend.domain.word.Word;
import com.example.backend.domain.word.WordRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.data.redis.core.StringRedisTemplate;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CardSelectService {

    private final WordRepository wordRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final TranslationService translationService;

    private static final long TTL_SECONDS = 1800;

    //5개의 카드 고르기 문제 생성
    public List<CardProblem> createProblems() {
        List<Word> answerWords = wordRepository.findRandomWords(5);
        List<CardProblem> problems = new ArrayList<>();
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userLang = userDetails.getUser().getNativeLanguage();


        for (Word answer : answerWords) {
            List<Word> options = new ArrayList<>();
            //정답 단어
            options.add(answer);
            //나머지 오답 단어
            options.addAll(wordRepository.findRandomWordsExcludeId(answer.getId(), 3));

            // body만 추출
            List<String> texts = options.stream()
                    .map(Word::getBody)
                    .toList();
            
            //모국어 번역
            List<String> translations = translationService.translate(texts, userLang);

            //매핑
            List<Card> cards = new ArrayList<>();
            for(int i = 0; i < options.size(); i++) {
                Word w = options.get(i);
                String translated = translations.get(i);
                cards.add(new Card(w.getId(), w.getBody(), w.getImageUrl(), translated));
            }

            Collections.shuffle(cards);

            int answerIndex = -1;
            for(int i = 0; i < cards.size();i++) {
                if(cards.get(i).getWordId() == answer.getId()){
                    answerIndex = i;
                    break;
                }
            }

            problems.add(new CardProblem( answerIndex, cards));
        }

        return problems;
    }

    //5개의 카드 고르기 문제를 하나로 묶어서 반환
    public String createProblemSet(){
        try{
            List<CardProblem> problems = createProblems();

            String problemSetId = UUID.randomUUID().toString();
            CardProblemSet problemSet = new CardProblemSet(problemSetId, problems);

            String json = objectMapper.writeValueAsString(problemSet);
            redisTemplate.opsForValue().set(problemSetId, json, TTL_SECONDS, TimeUnit.SECONDS);
            return problemSetId;
        } catch(JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    //id와 index를 바탕으로 적절한 문제 반환
    public CardProblem getProblem(String problemSetId, int problemIndex){
        try{
            String json = redisTemplate.opsForValue().get(problemSetId);
            if( json == null) throw new RuntimeException("해당 id의 문제를 찾을 수 없습니다.");

            CardProblemSet problemSet = objectMapper.readValue(json, CardProblemSet.class);

            List<CardProblem> problems = problemSet.getProblems();
            if(problemIndex<0 || problemIndex >= problems.size()) throw new IllegalArgumentException("유효하지 않은 인덱스입니다.");

            return problemSet.getProblems().get(problemIndex);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    //정답 확인
    public boolean checkAnswer(CardSelectRequest cardSelect){
        try{
            String json = redisTemplate.opsForValue().get(cardSelect.getProblemSetId());
            if(json == null) throw new RuntimeException("해당 id의 문제를 찾을 수 없습니다.");

            CardProblemSet problemSet = objectMapper.readValue(json, CardProblemSet.class);

            List<CardProblem> problems = problemSet.getProblems();
            int index = cardSelect.getProblemIndex();

            if (index < 0 || index >= problems.size()) throw new IllegalArgumentException("유효하지 않은 문제 인덱스입니다");
            //현재 문제 가져오기
            CardProblem problem = problems.get(index);

            int answerIndex = problem.getAnswerIndex();
            int userSelected = cardSelect.getSelectedCardIndex();

            return answerIndex == userSelected;
        } catch(JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
