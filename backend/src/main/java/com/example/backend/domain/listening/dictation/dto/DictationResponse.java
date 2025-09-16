package com.example.backend.domain.listening.dictation.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DictationResponse {
    boolean isCorrect;
    String userAnswer;
}
