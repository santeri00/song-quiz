import React from "react";
import { useState, useEffect, useRef } from 'react';
import PlayNavbar from "./PlayNavbar";
import { mockTracks } from "../mocks/mockTenTracks";
import { mockManyTracks } from "../mocks/mockManyTracks";
import AnswerCard from "./AnswerCard";
import QuestionCard from "./QuestionCard";
import Audio from "./Audio";

function PlayState({ trackList, rounds, setRounds,
  currentTrackIndex, setCurrentTrackIndex, score, setScore, allTracks, setGameState }) {
  console.log("tracklist:", trackList);
  const [currentTrack, setCurrentTrack] = useState(null)
  const [answers, setAnswers] = useState([])
  const [hasAnswered, setHasAnswered] = useState(false)

  console.log("allTracks in PlayState:", allTracks);
  console.log("trackList in PlayState:", trackList);
  const tracks = trackList; // change later
  const pool = allTracks;  // change later
  const audioRef = useRef(null);
  console.log("tracks in PlayState:", tracks);



  const generateRound = (roundIdx) => {
    const correct = tracks[roundIdx]

    const wrongAnswers = pool
      .filter(t => t.title !== correct.title)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [...wrongAnswers, correct]
      .sort(() => 0.5 - Math.random());

    setCurrentTrack(correct);
    setAnswers(options);
    setHasAnswered(false);
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  useEffect(() => {
    if (!tracks.length) return;
    if (currentTrackIndex >= rounds) {
      setGameState("end");
    }

    generateRound(currentTrackIndex);

    if (audioRef?.current && tracks[currentTrackIndex].preview) {
      audioRef.current.src = tracks[currentTrackIndex].preview;
      audioRef.current.play().catch(err => {
        console.log("Audio play prevented", err)
      });
    }

  }, [currentTrackIndex, tracks])

  const handleAnswer = (track) => {
    if (hasAnswered) return;

    setHasAnswered(true);

    if (track.title === currentTrack.title) {
      setScore(prev => prev + 1);
    }

    pauseAudio();

    setTimeout(() => {
      setCurrentTrackIndex(prev => prev + 1);
    }, 1500)
  }


  if (trackList.length === 0) {
    return (
      <p className="flex justify-center items-center h-screen">loading...</p>
    )
  } else {
    return (
      <div className="flex flex-col min-h-screen">
        <Audio audioRef={audioRef} />
        <PlayNavbar currentTrackIndex={currentTrackIndex} rounds={rounds} />
        <div className="flex flex-col items-center justify-center flex-1">
          <div className=" w-3/4 lg:w-1/3">


            <QuestionCard Question={"What's this track"} />

            <div className="grid grid-cols-2 grid-rows-2 gap-6 mt-8">
              {answers.map((track, index) => (
                <AnswerCard
                  key={track.id}
                  index={index + 1}
                  title={track.title}
                  isAnswer={track.title === currentTrack?.title}
                  disabled={hasAnswered}
                  onClick={() => handleAnswer(track)}
                />
              ))}
            </div>
          </div>
        </div>


      </div>
    );
  }

}

export default PlayState;
