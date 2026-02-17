package com.songquiz.backend.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.songquiz.backend.helper.WebClientService;
import com.songquiz.backend.model.GameStatus;
import com.songquiz.backend.model.Player;
import com.songquiz.backend.model.RoomState;
import com.songquiz.backend.model.SettingsDto;
import com.songquiz.backend.model.selectedPlayListDto;
import com.songquiz.backend.service.GameManagerService;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Controller
public class LobbyController {

  private final GameManagerService gameManagerService;
  private final WebClientService webClientService;

  public LobbyController(GameManagerService gameManagerService, WebClientService webClientService) {
    this.gameManagerService = gameManagerService;
    this.webClientService = webClientService;
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

  @MessageMapping("/lobby/{roomId}/start")
  @SendTo("/topic/lobby/{roomId}")
  public Mono<RoomState> startGame(@DestinationVariable String roomId) {
    RoomState room = gameManagerService.getRoom(roomId);

    if (room.getSelectedPlayListId() == null) {
      return Mono.just(room);
    }

    return webClientService.getGameSongs(room.getSelectedPlayListId(), room.getTotalRounds())
        .map(songs -> {
          if (songs.size() < room.getTotalRounds()) {
            log.warn("not enough songs, aborting game start");
            return room;
          }
          room.setCurrentRoundSongs(songs.subList(0, room.getTotalRounds()));
          room.setSongs(songs);
          room.setCurrentRound(1);
          room.setGameState(GameStatus.PLAYING);
          log.info("Room {} started the game", roomId);
          log.info("Selected songs: {}", songs.subList(0, room.getTotalRounds()));
          return room;
        });
  }

}
