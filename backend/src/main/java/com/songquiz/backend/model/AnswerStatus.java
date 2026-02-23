package com.songquiz.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnswerStatus {
  private boolean isCorrect;
  private Song song;
}
