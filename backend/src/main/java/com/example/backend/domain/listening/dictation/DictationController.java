package com.example.backend.domain.listening.dictation;

import com.example.backend.domain.listening.dictation.dto.Dictation;
import com.example.backend.domain.listening.dictation.dto.DictationCheckRequest;
import com.example.backend.domain.listening.dictation.dto.DictationSubmitResponse;
import com.example.backend.domain.listening.dictation.dto.DictationSubmitRequest;
import com.example.backend.domain.listening.ocr.OCRService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@Slf4j
@Controller
@RequestMapping("/listening/dictation")
@RequiredArgsConstructor
public class DictationController {

    private final DictationService dictationService;
    private final OCRService oCRService;

    @GetMapping("/start")
    public ResponseEntity<String> dictationStart(@RequestParam String type) {
        String problemId = dictationService.createProblemSet(type);
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
    public ResponseEntity<DictationSubmitResponse> dictationSubmit(
            @RequestBody DictationSubmitRequest dictationSubmitRequest
    ) throws Exception {

        byte[] imageBytes = Base64.getDecoder().decode(dictationSubmitRequest.getImageBase64());

        //ocr 처리
        String userAnswer = oCRService.detectText(imageBytes);

        DictationCheckRequest request = new DictationCheckRequest();
        request.setProblemSetId(dictationSubmitRequest.getProblemSetId());
        request.setProblemIndex(dictationSubmitRequest.getProblemIndex());
        request.setUserAnswer(userAnswer);

        //채점 결과
        return ResponseEntity.ok(dictationService.checkAnswer(request));
    }


}
