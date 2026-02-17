package com.songquiz.backend.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoomState {
  private String roomId;
  private List<Player> players = new ArrayList<>();

  private GameStatus gameState;
  private int currentRound;
  private int totalRounds;
  private String selectedPlayListId; // stores artists id to later fetch songs with
  private List<Song> songs;
  private List<Song> currentRoundSongs;
  private int maxPlayerCount = 8;

  public RoomState(String roomId) {
    this.roomId = roomId;
    this.gameState = GameStatus.LOBBY;
    this.currentRound = 0;
    this.songs = new ArrayList<>();
    this.currentRoundSongs = new ArrayList<>(totalRounds);
    this.totalRounds = 10;
  }

  public void addPlayer(Player player) {
    
    players.removeIf(p -> p.getSessionId().equals(player.getSessionId()));
    players.add(player);
  }

  public void removePlayer(String sessionId) {
    players.removeIf(p -> p.getSessionId().equals(sessionId));
  }

  public void setTotalRounds(int totalRounds) {
    this.totalRounds = totalRounds;
    this.currentRoundSongs = new ArrayList<>(totalRounds);
  }

  public void resetForNewGame() {
    this.gameState = GameStatus.LOBBY;
    this.currentRound = 0;
    this.songs.clear();
    this.currentRoundSongs.clear();
    players.forEach(Player::resetForNewGame);
  }

  public boolean removePlayerBySessionId(String sessionId) {
    if (sessionId == null)
      return false;
    return players.removeIf(p -> sessionId.equals(p.getSessionId()));
  }

}
