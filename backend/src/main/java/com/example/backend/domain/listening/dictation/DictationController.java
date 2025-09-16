package com.example.backend.domain.listening.dictation;

import com.example.backend.domain.listening.dictation.dto.Dictation;
import com.example.backend.domain.listening.dictation.dto.DictationRequest;
import com.example.backend.domain.listening.dictation.dto.DictationResponse;
import com.example.backend.domain.listening.ocr.OCRService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Controller
@RequestMapping("/listening/dictation")
@RequiredArgsConstructor
public class DictationController {

    private final DictationService dictationService;
    private final OCRService oCRService;

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
    public ResponseEntity<DictationResponse> dictationSubmit(
            @RequestParam("image") MultipartFile image,
            @RequestParam("problemSetId") String problemSetId,
            @RequestParam("problemIndex") int problemIndex
    ) throws Exception {
        //ocr 처리
        String userAnswer = oCRService.detectText(image.getBytes());
        DictationRequest request = new DictationRequest();
        request.setProblemSetId(problemSetId);
        request.setProblemIndex(problemIndex);
        request.setUserAnswer(userAnswer);

        //채점
        boolean isCorrect = dictationService.checkAnswer(request);

        DictationResponse response = new DictationResponse();
        response.setUserAnswer(userAnswer);
        response.setCorrect(isCorrect);

        return ResponseEntity.ok(response);
    }


}
