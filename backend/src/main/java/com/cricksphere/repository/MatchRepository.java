package com.cricksphere.repository;

import com.cricksphere.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    // Add custom queries here if needed
}
