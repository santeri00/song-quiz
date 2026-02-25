import { useState, useEffect, useRef } from 'react';
import PlayNavbar from "../../Quickplay/components/PlayNavbar";
import AnswerCard from "../components/AnswerCard";
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
  players,
  revealAnswerState,
  options,
}) {
  const [currentOptions, setCurrentOptions] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showScoreBoard, setShowScoreBoard] = useState(true);
  const [ScoreBoardPlayers, setScoreBoardPlayers] = useState(players);

  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(25);

  const [selectedTitle, setSelectedTitle] = useState(null);
  const audioRef = useRef(null);

  //timer for player to choose an answer in given time
  useEffect(() => {
    if (!isReady || revealAnswerState || hasAnswered) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !hasAnswered) {
      handleAnswerAfterTimeRanOut();
    }
  }, [timeLeft, isReady, revealAnswerState, hasAnswered])

  //timer between the rounds, counting down from 3,2,1
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
    console.log("idkk");
    setHasAnswered(false);
    const correctSong = songs[currentRound - 1];

    if (!correctSong) return;
    setCurrentOptions(options);
    if (audioRef?.current && correctSong.previewUrl) {
      audioRef.current.src = correctSong.previewUrl;
      audioRef.current.play().catch(err => {
        console.log("Audio play prevented", err)
      });
    }
  }, [currentRound, songs, allTracks, totalRounds, clientRef, isReady, currentOptions.length])

  //round reset logic
  useEffect(() => {
    setHasAnswered(false);
    setIsReady(false);
    setCountdown(3);
    setCurrentOptions([]);
    setScoreBoardPlayers(players);
    setTimeLeft(25);
  }, [currentRound])

  const handleAnswerAfterTimeRanOut = () => {
    console.log("lol111");
    setHasAnswered(true);
    if (clientRef.current) {
      clientRef.current.publish({
        destination: `/app/lobby/${roomId}/answer`,
        body: JSON.stringify({
          username,
          score: 0,
        })
      })

    }
  }
  const handleAnswer = (selectedTrack) => {
    if (hasAnswered) return;

    setHasAnswered(true);
    setSelectedTitle(selectedTrack.title);
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
                title={track.title}
                isAnswer={track.title === songs[currentRound - 1].title}
                hasAnswered={hasAnswered}
                onClick={() => handleAnswer(track)}
                revealAnswerState={revealAnswerState}
                isSelected={selectedTitle === track.title}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}