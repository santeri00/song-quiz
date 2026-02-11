package com.songquiz.backend.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.songquiz.backend.model.Player;
import com.songquiz.backend.model.RoomState;
import com.songquiz.backend.model.SettingsDto;
import com.songquiz.backend.model.selectedPlayListDto;
import com.songquiz.backend.service.GameManagerService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
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
      log.info("Player {} joined room {}", player, roomId);
      return room;
    }
    return room;

  }

  @MessageMapping("/lobby/{roomId}/settings")
  @SendTo("/topic/lobby/{roomId}")
  public RoomState updateSettings(@DestinationVariable String roomId, @Payload SettingsDto settings) {
    RoomState room = gameManagerService.getRoom(roomId);

    if (room != null) {
      room.setTotalRounds(settings.getRounds());

      log.info("Room {} updated settings: {}", roomId, settings);
    }
    return room;
  }

  @MessageMapping("/lobby/{roomId}/playlist")
  @SendTo("/topic/lobby/{roomId}")
  public RoomState setPlayList(@DestinationVariable String roomId, @Payload selectedPlayListDto playList) {
    RoomState room = gameManagerService.getRoom(roomId);

    if (room != null) {
      room.setSelectedPlayListId(playList.getArtistId());

      log.info("Room {} updated playlist: {}", roomId, playList);
    }
    return room;
  }

}
