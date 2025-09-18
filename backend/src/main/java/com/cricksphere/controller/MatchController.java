package com.cricksphere.controller;

import com.cricksphere.model.Match;
import com.cricksphere.model.Team;
import com.cricksphere.repository.MatchRepository;
import com.cricksphere.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;

    @Autowired
    public MatchController(MatchRepository matchRepository, TeamRepository teamRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
    }

    @GetMapping
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Match> getMatchById(@PathVariable Long id) {
        return matchRepository.findById(id);
    }

    @PostMapping
    public Match createMatch(@RequestBody Match match) {
        if (match.getTeam1() != null && match.getTeam1().getId() != null) {
            Team team1 = teamRepository.findById(match.getTeam1().getId())
                    .orElseThrow(() -> new RuntimeException("Team1 not found"));
            match.setTeam1(team1);
        }

        if (match.getTeam2() != null && match.getTeam2().getId() != null) {
            Team team2 = teamRepository.findById(match.getTeam2().getId())
                    .orElseThrow(() -> new RuntimeException("Team2 not found"));
            match.setTeam2(team2);
        }

        return matchRepository.save(match);
    }

    @PutMapping("/{id}")
    public Match updateMatch(@PathVariable Long id, @RequestBody Match updatedMatch) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setMatchDate(updatedMatch.getMatchDate());
        match.setVenue(updatedMatch.getVenue());
        match.setResult(updatedMatch.getResult());

        if (updatedMatch.getTeam1() != null && updatedMatch.getTeam1().getId() != null) {
            Team team1 = teamRepository.findById(updatedMatch.getTeam1().getId())
                    .orElseThrow(() -> new RuntimeException("Team1 not found"));
            match.setTeam1(team1);
        }

        if (updatedMatch.getTeam2() != null && updatedMatch.getTeam2().getId() != null) {
            Team team2 = teamRepository.findById(updatedMatch.getTeam2().getId())
                    .orElseThrow(() -> new RuntimeException("Team2 not found"));
            match.setTeam2(team2);
        }

        return matchRepository.save(match);
    }

    @DeleteMapping("/{id}")
    public void deleteMatch(@PathVariable Long id) {
        matchRepository.deleteById(id);
    }
}
