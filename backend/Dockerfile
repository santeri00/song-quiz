
# Build the app
FROM gradle:8.14.1-jdk21 AS build
WORKDIR /app

# Copy the Gradle wrapper and project files
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src src

# Make the wrapper executable and build the .jar (skipping tests)
RUN chmod +x gradlew
RUN ./gradlew build -x test

# Run the app
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy ONLY the finished .jar file from Stage 1
COPY --from=build /app/build/libs/*.jar app.jar

# Tell Docker what port the app uses internally
EXPOSE 5000

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]