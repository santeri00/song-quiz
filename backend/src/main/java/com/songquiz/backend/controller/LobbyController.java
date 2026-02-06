package com.songquiz.backend.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.songquiz.backend.model.Player;
import com.songquiz.backend.model.RoomState;
import com.songquiz.backend.service.GameManagerService;

@Controller
public class LobbyController {

  private final GameManagerService gameManagerService;

  public LobbyController(GameManagerService gameManagerService) {
    this.gameManagerService = gameManagerService;
  }

  @MessageMapping("/lobby/{roomId}/join")
  @SendTo("/topic/lobby/{roomId}")
  public RoomState joinRoom(@DestinationVariable String roomId,
      @Payload Player player, SimpMessageHeaderAccessor headerAccessor) {

    RoomState room = gameManagerService.getRoom(roomId);

    if (room != null) {
      String sessionId = headerAccessor.getSessionId();
      player.setSessionId(sessionId);
      if (room.getPlayers().isEmpty()) {
        player.setHost(true);
      }
      room.addPlayer(player);
      return room;
    }
    return room;

  }

}
