package com.songquiz.backend.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.songquiz.backend.model.Player;
import com.songquiz.backend.model.RoomState;

@Service
public class GameManagerService {

  private final Map<String, RoomState> activeGames = new ConcurrentHashMap<>();

  public RoomState createRoom() {
    String roomId = generateUniqueRoomId();
    RoomState room = new RoomState(roomId);

    activeGames.put(roomId, room);
    return room;
  }

  public RoomState getRoom(String roomId) {
    return activeGames.get(roomId);
  }

  public String generateUniqueRoomId() {
    String roomId;
    do {
      roomId = String.valueOf((int) (Math.random() * 10000));
    } while (activeGames.containsKey(roomId));
    return roomId;
  }

  public Map<String, RoomState> getActiveRooms() {
    return activeGames;
  }

}
