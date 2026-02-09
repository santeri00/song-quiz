package com.songquiz.backend.model;

import java.util.ArrayList;
import java.util.List;

public class RoomState {
  private String roomId;
  private List<Player> players = new ArrayList<>();

  private GameStatus gameState;
  private int currentRound;
  private int totalRounds;
  private List<Song> songs;

  public RoomState(String roomId) {
    this.roomId = roomId;
    this.gameState = GameStatus.LOBBY;
    this.currentRound = 0;
    this.songs = new ArrayList<>();
    this.totalRounds = 10;
  }

  public void addPlayer(Player player) {
    players.removeIf(p -> p.getSessionId().equals(player.getSessionId()));
    players.add(player);
  }

  public void removePlayer(String sessionId) {
    players.removeIf(p -> p.getSessionId().equals(sessionId));
  }

  public String getRoomId() {
    return roomId;
  }

  public List<Player> getPlayers() {
    return players;
  }

  public GameStatus getGameState() {
    return gameState;
  }

  public int getCurrentRound() {
    return currentRound;
  }

  public List<Song> getSongs() {
    return songs;
  }

  public void setGameState(GameStatus gameState) {
    this.gameState = gameState;
  }

  public void setCurrentRound(int currentRound) {
    this.currentRound = currentRound;
  }

  public int getTotalRounds() {
    return totalRounds;
  }

  public void setTotalRounds(int totalRounds) {
    this.totalRounds = totalRounds;
  }

  public void setSongs(List<Song> songs) {
    this.songs = songs;
  }

  public void resetForNewGame() {
    this.gameState = GameStatus.LOBBY;
    this.currentRound = 0;
    this.songs.clear();
    for (Player player : players) {
      player.resetForNewGame();
    }
  }

  public boolean removePlayerBySessionId(String sessionId) {
    if (sessionId == null)
      return false;
    return players.removeIf(p -> sessionId.equals(p.getSessionId()));
  }

}
