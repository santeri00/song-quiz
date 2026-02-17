package com.songquiz.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Song {

  private String artist;
  private String title;
  private String previewUrl;

  @Override
  public String toString() {
    return "Song{" +
        "artist='" + artist + '\'' +
        ", title='" + title + '\'' +
        '}';
  }
}
