package com.songquiz.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Song {

  private String id;
  private String title;
  private String artist;
  private String album;
}
