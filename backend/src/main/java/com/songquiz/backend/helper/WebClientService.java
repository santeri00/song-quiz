package com.songquiz.backend.helper;

import reactor.netty.http.client.HttpClient;
import java.time.Duration;

import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

import com.songquiz.backend.error.RetryException;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

public class WebClientService {

  private final WebClient webClient;

  public WebClientService(WebClient.Builder webClientBuilder) {
    HttpClient httpClient = HttpClient.create()
        .keepAlive(false)
        .responseTimeout(Duration.ofSeconds(10));

    this.webClient = webClientBuilder
        .baseUrl("https://api.deezer.com")
        .clientConnector(new ReactorClientHttpConnector(httpClient))
        .build();
  }

  public Mono<JsonNode> fetchAllAlbums(String url) {
    return webClient.get()
        .uri(url)
        .retrieve()
        .bodyToMono(JsonNode.class)
        .retryWhen(Retry.backoff(3, Duration.ofSeconds(2))
            .filter(throwable -> throwable instanceof RetryException))
        .flatMap(response -> {

          ArrayNode currentData = (ArrayNode) response.get("data");

          JsonNode nextNode = response.get("next");

          if (nextNode == null || nextNode.isNull()) {
            // No more pages -> return final result
            ObjectNode result = (ObjectNode) response.deepCopy();
            result.set("data", currentData);
            result.remove("next");
            return Mono.<JsonNode>just(result);
          }

          // Fetch next page recursively
          return fetchAllAlbums(nextNode.asString())
              .map(nextResponse -> {
                ArrayNode nextData = (ArrayNode) nextResponse.get("data");

                currentData.addAll(nextData);

                ObjectNode result = (ObjectNode) response.deepCopy();
                result.set("data", currentData);
                result.remove("next");

                return result;
              });
        })
        .onErrorResume(e -> Mono.error(new RuntimeException("Deezer fetch failed", e)));
  }
}