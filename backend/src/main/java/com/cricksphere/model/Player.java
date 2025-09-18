package com.cricksphere.model;

import jakarta.persistence.*;

@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String role; // Batsman, Bowler, etc.
    private int age;

    private String battingStyle;
    private String bowlingStyle;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    public Player() {}

    public Player(Long id, String name, String role, int age, String battingStyle, String bowlingStyle, Team team) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.age = age;
        this.battingStyle = battingStyle;
        this.bowlingStyle = bowlingStyle;
        this.team = team;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getBattingStyle() { return battingStyle; }
    public void setBattingStyle(String battingStyle) { this.battingStyle = battingStyle; }

    public String getBowlingStyle() { return bowlingStyle; }
    public void setBowlingStyle(String bowlingStyle) { this.bowlingStyle = bowlingStyle; }

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
}
