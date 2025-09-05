package com.example.backend.domain.listening.dictation;

import com.example.backend.domain.listening.dictation.dto.Dictation;
import com.example.backend.domain.listening.dictation.dto.DictationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Controller
@RequestMapping("/listening/dictation")
@RequiredArgsConstructor
public class DictationController {

    private final DictationService dictationService;

    @GetMapping("/start")
    public ResponseEntity<String> dictationStart() {
        String problemId = dictationService.createProblemSet();
        return ResponseEntity.ok(problemId);
    }

    @GetMapping("/problem")
    public ResponseEntity<Dictation> dictationProblem(
        @RequestParam String problemSetId,
        @RequestParam int problemIndex
    ) {
        Dictation problem = dictationService.getDictation(problemSetId, problemIndex);
        return ResponseEntity.ok(problem);
    }

    @PostMapping("/submit")
    public ResponseEntity<Boolean> dictationSubmit(
            @RequestBody DictationRequest dictationRequest
    ){
        boolean isCorrect = dictationService.checkAnswer(dictationRequest);
        return ResponseEntity.ok(isCorrect);
    }


}
