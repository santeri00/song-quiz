package com.songquiz.backend.model;

public class Player {
  private String sessionId;
  private String nickname;
  private double score;
  private boolean isHost;
  private boolean guessIsCorrect;

  public Player(String sessionId, String nickname) {
    this.sessionId = sessionId;
    this.nickname = nickname;
    this.score = 0.0;
    this.isHost = false;
    this.guessIsCorrect = false;
  }

  public String getSessionId() {
    return sessionId;
  }

  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }

  public String getNickname() {
    return nickname;
  }

  public double getScore() {
    return score;
  }

  public boolean isHost() {
    return isHost;
  }

  public boolean isGuessIsCorrect() {
    return guessIsCorrect;
  }

  public void setScore(double score) {
    this.score = score;
  }

  public void setHost(boolean isHost) {
    this.isHost = isHost;
  }

  public void setGuessIsCorrect(boolean guessIsCorrect) {
    this.guessIsCorrect = guessIsCorrect;
  }

  public void updateScore(double points) {
    this.score += points;
  }

  public void resetForNewRound() {
    this.guessIsCorrect = false;
  }

  public void resetForNewGame() {
    this.score = 0.0;
    this.guessIsCorrect = false;
  }

}
