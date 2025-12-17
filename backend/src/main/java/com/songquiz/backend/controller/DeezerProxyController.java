package com.songquiz.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;
import tools.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/deezer")
@CrossOrigin(origins = "*")
public class DeezerProxyController {

  private final WebClient webClient;

  public DeezerProxyController(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.baseUrl("https://api.deezer.com").build();
  }

  @GetMapping("/{albumId}/tracks")
  public Mono<ResponseEntity<JsonNode>> getAlbumTracks(@PathVariable String albumId) {
    return webClient.get()
        .uri("/album/{albumId}/tracks", albumId)
        .retrieve()
        .bodyToMono(
            JsonNode.class)
        .onErrorResume(e -> {
          return Mono.error(new RuntimeException("Deezer fetch failed"));
        })
        .map(responseBody -> ResponseEntity.ok(responseBody));
  }

  @GetMapping("/artist/{artistId}/albums")
  public Mono<ResponseEntity<JsonNode>> getMethodName(@PathVariable String artistId) {
    return webClient.get()
        .uri("/artist/{artistId}/albums", artistId)
        .retrieve()
        .bodyToMono(
            JsonNode.class)
        .onErrorResume(e -> {
          return Mono.error(new RuntimeException("Deezer fetch failed"));
        })
        .map(responseBody -> ResponseEntity.ok(responseBody));
  }

}
