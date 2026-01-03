package com.songquiz.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.songquiz.backend.helper.JsonNodeService;
import com.songquiz.backend.helper.WebClientService;

import reactor.core.publisher.Mono;
import tools.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/deezer")
@CrossOrigin(origins = "*")
public class DeezerProxyController {

  private final WebClient webClient;
  private final WebClientService webClientService;

  public DeezerProxyController(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.baseUrl("https://api.deezer.com").build();
    this.webClientService = new WebClientService(webClientBuilder);
  }

  @GetMapping("/{albumId}/tracks")
  public Mono<ResponseEntity<JsonNode>> getAlbumTracks(@PathVariable String albumId) {
    return webClient.get()
        .uri("/album/{albumId}/tracks", albumId)
        .retrieve()
        .bodyToMono(JsonNode.class)
        .map(JsonNodeService::mapTracks)
        .onErrorResume(e -> {
          return Mono.error(new RuntimeException("Deezer fetch failed"));
        })
        .map(ResponseEntity::ok);
  }

  @GetMapping("/artist/{artistId}/albums")
  public Mono<ResponseEntity<JsonNode>> getMethodName(@PathVariable String artistId) {
    return webClientService.fetchAllAlbums("/artist/" + artistId + "/albums")
        .map(ResponseEntity::ok);
  }

  @GetMapping("/test/500")
  public Mono<String> simulate500() {
    throw new RuntimeException("Simulated internal server error");
  }

}
