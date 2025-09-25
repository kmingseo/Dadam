package com.example.backend.domain.listening.dictation.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DictationSubmitResponse {
    private boolean isCorrect;
    private String userAnswer;
    private String answer;
}
