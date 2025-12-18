import React from "react";
import { useState, useEffect, useRef } from 'react';
import PlayNavbar from "./PlayNavbar";
function PlayState({ trackList }) {
  console.log("tracklist:", trackList);

  if (!trackList) {
    return (
      <p>loading...</p>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center">
        <PlayNavbar />
        {/* <ul>
        {trackList.map((track) => {

        })}
      </ul> */}
      </div>
    );
  }

}

export default PlayState;
