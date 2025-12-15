import React from "react";
import { useState, useEffect, useRef } from 'react';

function PlayState({ trackList }) {


  return (
    <div className="flex flex-col items-center justify-center">
      {playState === 'loading' && <p>Loading...</p>}
      {playState === 'playing' && <p>Playing</p>}
      {playState === 'paused' && <p>Paused</p>}
      {playState === 'stopped' && <p>Stopped</p>}
    </div>
  );
}

export default PlayState;
