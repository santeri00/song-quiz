import React from "react";
import { useState, useEffect, useRef } from 'react';
import PlayNavbar from "./PlayNavbar";
import { mockTracks } from "../mocks/mockTenTracks";
import AnswerCard from "./AnswerCard";
import QuestionCard from "./QuestionCard";

function PlayState({ trackList }) {
  console.log("tracklist:", trackList);
  trackList = mockTracks; // temporary override for testing
  if (trackList.length === 0) {
    return (
      <p className="flex justify-center items-center h-screen">loading...</p>
    )
  } else {
    return (
      <div className="flex flex-col min-h-screen">
        <PlayNavbar />
        <div className="flex flex-col items-center justify-center flex-1">
          <div className=" w-3/4 lg:w-1/3">


            <QuestionCard Question={"test question"} />

            <div className="grid grid-cols-2 grid-rows-2 gap-6 mt-8">
              <AnswerCard index={1} />
              <AnswerCard index={2} />
              <AnswerCard index={3} />
              <AnswerCard index={4} />
            </div>
          </div>
        </div>


      </div>
    );
  }

}

export default PlayState;
