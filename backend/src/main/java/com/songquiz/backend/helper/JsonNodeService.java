package com.songquiz.backend.helper;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

public class JsonNodeService {

  public static JsonNode mapTracks(JsonNode responseBody) {
    ObjectMapper mapper = new ObjectMapper();
    ArrayNode resultTracks = mapper.createArrayNode();

    JsonNode dataNode = responseBody.get("data");

    if (dataNode == null || !dataNode.isArray()) {
      throw new IllegalStateException("Invalid id or unexpected response structure from Deezer API");
    }

    dataNode.forEach(track -> {
      ObjectNode n = mapper.createObjectNode();
      n.put("id", track.get("id").asLong());
      n.put("title", track.get("title").asString());
      n.put("preview", track.get("preview").asString());

      resultTracks.add(n);

    });
    return resultTracks;
  }
}
