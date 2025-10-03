package com.example.backend.domain.listening.dictation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DictationSubmitRequest {
    private String imageBase64;
    private String problemSetId;
    private int problemIndex;
}
