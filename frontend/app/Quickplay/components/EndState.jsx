import React from "react";

export default function EndState({ trackList, score, scoreList }) {

  return (
    <section>
      <p>end</p>
      <ul>
        {scoreList.map((score, index) => (
          <li key={index}>
            <span>{score.title}</span>
            <span>{score.correct ? "1" : "0"}</span>
          </li>

        ))}
      </ul>
    </section>
  )
}