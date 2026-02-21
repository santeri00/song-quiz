import { useState, useEffect, useRef } from 'react';
import PlayNavbar from "../../Quickplay/components/PlayNavbar";
import AnswerCard from "../../Quickplay/components/AnswerCard";
import QuestionCard from "../../Quickplay/components/QuestionCard";
import Audio from "../../Quickplay/components/Audio";
import ScoreBoard from "./ScoreBoard";
export default function MultiPlayState({
  roomId,
  username,
  clientRef,
  currentRound,
  totalRounds,
  songs,
  allTracks,
  players

}) {
  const [currentOptions, setCurrentOptions] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showScoreBoard, setShowScoreBoard] = useState(true);
  const [ScoreBoardPlayers, setScoreBoardPlayers] = useState(players);

  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!songs || songs.length === 0) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown, songs]);

  useEffect(() => {
    if (!clientRef.current) return;
    if (currentRound > totalRounds) return;
    if (songs.length === 0) return;
    if (allTracks.length === 0) return;
    if (!isReady) return;
    if (currentOptions.length > 0) return;

    setHasAnswered(false);
    const correctSong = songs[currentRound - 1];

    if (!correctSong) return;

    const wrongOptions = allTracks
      .filter(track => track.title !== correctSong.title)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [...wrongOptions, correctSong].sort(() => 0.5 - Math.random());

    setCurrentOptions(options);

    if (audioRef?.current && correctSong.previewUrl) {
      audioRef.current.src = correctSong.previewUrl;
      audioRef.current.play().catch(err => {
        console.log("Audio play prevented", err)
      });
    }
  }, [currentRound, songs, allTracks, totalRounds, clientRef, isReady, currentOptions.length])

  useEffect(() => {
    setHasAnswered(false);
    setIsReady(false);
    setCountdown(3);
    setCurrentOptions([]);
    setScoreBoardPlayers(players);
  }, [currentRound])

  const handleAnswer = (selectedTrack) => {
    if (hasAnswered) return;

    setHasAnswered(true);

    const isCorrect = selectedTrack.title === songs[currentRound - 1].title;

    if (clientRef.current) {
      clientRef.current.publish({
        destination: `/app/lobby/${roomId}/answer`,
        body: JSON.stringify({
          username,
          score: isCorrect ? 1 : 0
        })
      })

    }

  }

  if (!songs || songs.length === 0 || currentRound < 1) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
        <p>Loading game...</p>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-900 text-white items-center justify-center">
        <h1 className="text-8xl font-bold animate-pulse text-teal-500">
          {countdown > 0 ? countdown : "GO!"}
        </h1>
        <p className="mt-4 text-2xl text-gray-400">Get Ready...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">


      <div className="hidden md:block max-[1020px]:right-1">
        <Audio audioRef={audioRef} />
      </div>

      <PlayNavbar currentTrackIndex={currentRound} rounds={totalRounds} />
      <div className="absolute top-1/3 left-6">
        {
          showScoreBoard && <ScoreBoard players={ScoreBoardPlayers} user={username} />
        }
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-3/5 lg:w-4/9">

          <QuestionCard Question={"Guess the Song"} />

          <div className="grid grid-cols-2 grid-rows-2 gap-6 mt-8">
            {currentOptions.map((track, index) => (
              <AnswerCard
                key={index}
                index={index + 1}
                title={track.title}
                isAnswer={track.title === songs[currentRound - 1].title}
                hasAnswered={hasAnswered}
                onClick={() => handleAnswer(track)}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}