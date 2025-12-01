package com.example.backend.domain.speaking;

public class Sentence {
    private Long id;
    private String text;
    private String language;

    public Sentence(Long id, String text, String language) {
        this.id = id;
        this.text = text;
        this.language = language;
    }

    // Getter
    public Long getId() { return id; }
    public String getText() { return text; }
    public String getLanguage() { return language; }

    // Setter
    public void setId(Long id) { this.id = id; }
    public void setText(String text) { this.text = text; }
    public void setLanguage(String language) { this.language = language; }
}
