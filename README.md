# Song Quiz Multiplayer
This app is a song quiz that uses websockets for the ability to play multiplayer and is deployed with railway

link to site
https://songquiz.up.railway.app/ 

clicking play takes you to a new lobby where you can invite others with the clipboard button, or by copying the url.
the quickplay is for single player and might contain more bugs than the normal play
<img width="1688" height="822" alt="image" src="https://github.com/user-attachments/assets/28f3e25f-5754-439d-a3e5-a1653b57d69d" />
<img width="1706" height="821" alt="image" src="https://github.com/user-attachments/assets/84b7adf3-072f-4a0d-a692-5ad596bafcaf" />
<img width="1707" height="830" alt="image" src="https://github.com/user-attachments/assets/2f9bb972-151d-442d-93af-bcd1a82cd185" />


## Tech Stack
Frontend: Next.js, Tailwind CSS

Backend: Java 21, Spring Boot, Gradle
  
The app uses deezer api to pull the selected playlists or artists albums and uses the previewUrl given by deezer to play the songs.
App uses websockets to control the live game state and for example update the scoreboard based on who was fastest

**Deployment:**
* Railway (Dockerized Backend & Native Frontend)

## 

## Known issues
*in quickplay if a game is not started for a while the deezer api might crash, as it updates with new data frequently
