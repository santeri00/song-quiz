package com.songquiz.backend.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@NoArgsConstructor
@Slf4j
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
  private boolean revealAnswerState = false;
  private List<Song> options;
  private String playListName;
  private int answerPlacement = 0;
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
    if (sessionId == null) {
      return false;
    }
    Player player = players.stream().filter(p -> p.getSessionId().equals(sessionId)).findFirst().orElse(null);
    if (player == null) {
      return false;
    }
    boolean wasHost = player.isHost();
    players.remove(player);
    if (wasHost && !players.isEmpty()) {
      Player newHost = players.get(0);
      newHost.setHost(true);
      log.info("Host changed from {} to {}", player.getNickname(), newHost.getNickname());
    }
    return true;
  }

  public Player getPlayerByName(String name) {
    return players.stream()
        .filter(p -> p.getNickname().equals(name))
        .findFirst()
        .orElse(null);
  }

  public void generateOptions() {
    List<Song> roundOptions = new ArrayList<>();
    Song correctSong = currentRoundSongs.get(currentRound - 1);
    roundOptions.add(correctSong);

    List<Song> wrongSongs = new ArrayList<>(songs);
    wrongSongs.removeIf(song -> song.getTitle().equals(correctSong.getTitle()));

    Collections.shuffle(wrongSongs);
    roundOptions.addAll(wrongSongs.subList(0, 3));

    Collections.shuffle(roundOptions);
    options = roundOptions;
  }

}
