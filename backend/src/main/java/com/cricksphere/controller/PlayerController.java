package com.cricksphere.controller;

import com.cricksphere.model.Player;
import com.cricksphere.model.Team;
import com.cricksphere.repository.PlayerRepository;
import com.cricksphere.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/players")
public class PlayerController {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    @Autowired
    public PlayerController(PlayerRepository playerRepository, TeamRepository teamRepository) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
    }

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Player> getPlayerById(@PathVariable Long id) {
        return playerRepository.findById(id);
    }

    @PostMapping
    public Player createPlayer(@RequestBody Player player) {
        if (player.getTeam() != null && player.getTeam().getId() != null) {
            Team team = teamRepository.findById(player.getTeam().getId())
                    .orElseThrow(() -> new RuntimeException("Team not found"));
            player.setTeam(team);
        }
        return playerRepository.save(player);
    }

    @PutMapping("/{id}")
    public Player updatePlayer(@PathVariable Long id, @RequestBody Player updatedPlayer) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        player.setName(updatedPlayer.getName());
        player.setRole(updatedPlayer.getRole());
        player.setAge(updatedPlayer.getAge());
        player.setBattingStyle(updatedPlayer.getBattingStyle());
        player.setBowlingStyle(updatedPlayer.getBowlingStyle());

        if (updatedPlayer.getTeam() != null && updatedPlayer.getTeam().getId() != null) {
            Team team = teamRepository.findById(updatedPlayer.getTeam().getId())
                    .orElseThrow(() -> new RuntimeException("Team not found"));
            player.setTeam(team);
        }

        return playerRepository.save(player);
    }

    @DeleteMapping("/{id}")
    public void deletePlayer(@PathVariable Long id) {
        playerRepository.deleteById(id);
    }
}
