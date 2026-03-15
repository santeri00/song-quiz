package com.songquiz.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.songquiz.backend.model.RoomState;
import com.songquiz.backend.service.GameManagerService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RestController
@RequestMapping("/api/lobby")
public class LobbyApiController {

  private final GameManagerService gameManagerService;

  public LobbyApiController(GameManagerService gameManagerService) {
    this.gameManagerService = gameManagerService;
  }

  @PostMapping("/create")
  public ResponseEntity<String> createRoom(@RequestBody Map<String, String> payload) {

    RoomState room = gameManagerService.createRoom();
    log.info("Room {} created", room.getRoomId());
    return ResponseEntity.ok(room.getRoomId());
  }

  @GetMapping("/active")
  public ResponseEntity<String> getRoomById(@RequestParam String roomId) {
    RoomState room = gameManagerService.getRoom(roomId);
    if (room == null) {
      return ResponseEntity.notFound().build();
    }

    if (room.getPlayers().size() >= room.getMaxPlayerCount()) {
      return ResponseEntity.status(403).body("Room is full");
    }

    return ResponseEntity.ok(room.getRoomId());

  }

}
