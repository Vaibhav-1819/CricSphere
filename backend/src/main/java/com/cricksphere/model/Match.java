package com.cricksphere.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate matchDate;
    private String venue;

    @ManyToOne
    @JoinColumn(name = "team1_id")
    private Team team1;

    @ManyToOne
    @JoinColumn(name = "team2_id")
    private Team team2;

    private String result; // e.g., "Team1 won by 5 runs"

    public Match() {}

    public Match(Long id, LocalDate matchDate, String venue, Team team1, Team team2, String result) {
        this.id = id;
        this.matchDate = matchDate;
        this.venue = venue;
        this.team1 = team1;
        this.team2 = team2;
        this.result = result;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getMatchDate() { return matchDate; }
    public void setMatchDate(LocalDate matchDate) { this.matchDate = matchDate; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public Team getTeam1() { return team1; }
    public void setTeam1(Team team1) { this.team1 = team1; }

    public Team getTeam2() { return team2; }
    public void setTeam2(Team team2) { this.team2 = team2; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
}
