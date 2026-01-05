package com.songquiz.backend.error;

public class RetryException extends RuntimeException {
  public RetryException(String message) {
    super(message);
  }
}
