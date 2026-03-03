package com.songquiz.backend.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class Player {
  private String sessionId;
  private String nickname;
  private int score = 0;
  private boolean isHost;
  private boolean guessIsCorrect;
  private boolean hasAnswered;
  private List<AnswerStatus> answerHistory = new ArrayList<>();
  private int scoreThisRound = 0;

  public Player(String sessionId, String nickname) {
    this.sessionId = sessionId;
    this.nickname = nickname;
    this.score = 0;
    this.isHost = false;
    this.guessIsCorrect = false;
    this.hasAnswered = false;
  }

  public void updateScore(double points) {
    this.score += points;
  }

  public void resetForNewRound() {
    this.guessIsCorrect = false;
  }

  public void resetForNewGame() {
    this.score = 0;
    this.guessIsCorrect = false;
  }

}
