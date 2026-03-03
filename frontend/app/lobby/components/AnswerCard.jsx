import React from "react";

export default function AnswerCard({ title, isAnswer, hasAnswered, onClick, revealAnswerState, isSelected }) {

  const checkAnswer = () => {
    onClick();
  }

  let borderClass = "border-2";
  if (revealAnswerState) {
    borderClass = isAnswer
      ? "border-2 border-green-500"
      : "border-2 border-red-600"
  } else if (isSelected) {
    borderClass = "border-3 border-teal-600 text-teal-500";
  }

  return (
    <section className="">
      <div className={`flex-row hover:text-teal-500 transition-colors ease-in-out duration-200
      cursor-pointer bg-neutral-800  rounded-sm w-full h-28 items-center justify-center flex
        ${borderClass}
    `}
        onClick={checkAnswer}
      >
        <p className="p-5">{title}</p>
      </div>

    </section >
  )
}