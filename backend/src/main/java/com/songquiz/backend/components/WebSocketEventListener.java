package com.songquiz.backend.components;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.songquiz.backend.model.RoomState;
import com.songquiz.backend.service.GameManagerService;

@Component
public class WebSocketEventListener {

  private final GameManagerService gameManagerService;
  private final SimpMessagingTemplate messagingTemplate;

  public WebSocketEventListener(GameManagerService gameManagerService, SimpMessagingTemplate messagingTemplate) {
    this.gameManagerService = gameManagerService;
    this.messagingTemplate = messagingTemplate;
  }

  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
    String sessionId = event.getSessionId();
    for (RoomState room : gameManagerService.getActiveRooms().values()) {

      boolean removed = room.removePlayerBySessionId(sessionId);

      if (removed) {
        System.out.println("Player disconnected: " + sessionId);
        if (room.getPlayers().isEmpty()) {
          gameManagerService.getActiveRooms().remove(room.getRoomId());
          System.out.println("Room " + room.getRoomId() + " deleted (empty).");
        } else {
          messagingTemplate.convertAndSend("/topic/lobby/" + room.getRoomId(), room);
        }

        break;
      }
    }
  }

}
