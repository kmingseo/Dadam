package com.example.backend.domain.listening.cardSelect.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//카드에 필요한 데이터
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Card {
    private int wordId;
    private String body;
    private String imageUrl;
    private String translatedBody;
}
