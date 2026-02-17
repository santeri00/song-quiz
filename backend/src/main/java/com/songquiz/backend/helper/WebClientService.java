package com.songquiz.backend.helper;

import reactor.netty.http.client.HttpClient;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.songquiz.backend.error.RetryException;
import com.songquiz.backend.model.Song;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

@Service
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

  // fetches all albums and singles
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

  public Mono<JsonNode> fetchOnlyAlbums(String url) {
    return webClient.get()
        .uri(url)
        .retrieve()
        .bodyToMono(ObjectNode.class)
        .expand(response -> {
          JsonNode nextNode = response.get("next");

          if (nextNode == null || nextNode.isNull()) {
            return Mono.empty();
          }

          return webClient.get()
              .uri(nextNode.asString())
              .retrieve()
              .bodyToMono(ObjectNode.class);
        })
        .map(pageResponse -> {
          ArrayNode data = (ArrayNode) pageResponse.get("data");

          if (data != null) {
            List<JsonNode> keptAlbums = new ArrayList<>();

            for (JsonNode item : data) {
              JsonNode typeNode = item.get("record_type");
              String type = (typeNode != null) ? typeNode.asString() : "";

              if ("album".equalsIgnoreCase(type) || "ep".equalsIgnoreCase(type)) {
                keptAlbums.add(item);
              }
            }

            data.removeAll();
            data.addAll(keptAlbums);
          }

          return pageResponse;
        })
        .reduce((accumulatedResponse, currentPage) -> {
          ArrayNode allData = (ArrayNode) accumulatedResponse.get("data");
          ArrayNode pageData = (ArrayNode) currentPage.get("data");

          if (allData != null && pageData != null) {
            allData.addAll(pageData);
          }

          return accumulatedResponse;
        })

        .map(finalResult -> {
          ((ObjectNode) finalResult).remove("next");
          return finalResult;
        });
  }

  public Mono<List<Song>> fetchAlbumTracks(long albumId) {
    return webClient.get()
        .uri("/album/" + albumId + "/tracks")
        .retrieve()
        .bodyToMono(JsonNode.class)
        .map(response -> {
          List<Song> songs = new ArrayList<>();
          JsonNode data = response.get("data");

          if (data != null && data.isArray()) {
            for (JsonNode track : data) {
              String title = track.get("title").asString();
              String previewUrl = track.get("preview").asString();
              String artist = track.get("artist").get("name").asString();
              if (previewUrl != null && !previewUrl.isEmpty()) {
                songs.add(new Song(artist, title, previewUrl));
              }
            }
          }
          return songs;
        });
  }

  public Mono<List<Song>> getGameSongs(String artistId, int totalRounds) {
    return fetchOnlyAlbums("/artist/" + artistId + "/albums")
        .flatMap(albumsJson -> {
          JsonNode data = albumsJson.get("data");
          if (data == null || data.isEmpty()) {
            return Mono.just(Collections.<Song>emptyList());
          }
          List<Long> albumIds = StreamSupport.stream(data.spliterator(), false)
              .map(node -> node.get("id").asLong())
              .collect(Collectors.toList());
          return Flux.fromIterable(albumIds)
              .flatMap(this::fetchAlbumTracks, 5)
              .collectList()
              .map(listOfLists -> {
                List<Song> allSongs = listOfLists.stream()
                    .flatMap(List::stream)
                    .collect(Collectors.toList());
                Collections.shuffle(allSongs);
                return allSongs;
              });
        });
  }
}