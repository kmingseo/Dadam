package com.example.backend.domain.sentence;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SentenceRepository extends JpaRepository<Sentence, Integer> {

    @Query(value="Select body FROM sentences ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<String> findRandomSentenceBodies(@Param("count") int count);
}
