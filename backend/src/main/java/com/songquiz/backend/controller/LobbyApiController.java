package com.songquiz.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.songquiz.backend.model.RoomState;
import com.songquiz.backend.service.GameManagerService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/lobby")
@CrossOrigin(origins = "*")
public class LobbyApiController {

  private final GameManagerService gameManagerService;

  public LobbyApiController(GameManagerService gameManagerService) {
    this.gameManagerService = gameManagerService;
  }

  @PostMapping("/create")
  public ResponseEntity<String> createRoom(@RequestBody Map<String, String> payload) {

    RoomState room = gameManagerService.createRoom();
    return ResponseEntity.ok(room.getRoomId());
  }

}
