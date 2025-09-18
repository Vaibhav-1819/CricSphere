package com.cricksphere.service;

import com.cricksphere.model.Player;
import com.cricksphere.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    // Create or Update
    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    // Get all players
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    // Get player by ID
    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    // Delete player by ID
    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }
}
