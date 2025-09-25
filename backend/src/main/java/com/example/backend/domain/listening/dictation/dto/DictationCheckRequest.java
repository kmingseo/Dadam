package com.example.backend.domain.listening.dictation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DictationCheckRequest {
    private String problemSetId;
    private int problemIndex;
    private String userAnswer;
}
