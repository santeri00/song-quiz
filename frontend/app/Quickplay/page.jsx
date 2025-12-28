'use client'
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import SelectState from './components/SelectState';
import PlayState from './components/PlayState';
import { useGameLogic } from './hooks/useGameLogic';
import EndState from './components/EndState';

function Quickplay() {
  const game = useGameLogic();



  const renderState = () => {
    switch (game.gameState) {
      case 'select':
        return <SelectState {...game}
        />;
      case 'play':
        return <PlayState
          {...game}
        />;
      case 'end':
        return <EndState
          {...game}
        />;
      default:
        return null;
    }
  }
  return (
    <div>
      {renderState()}
    </div>
  )
}

export default Quickplay