import React from "react";

export default function AnswerCard({ index, title, isAnswer, hasAnswered, onClick }) {

  const checkAnswer = () => {
    isAnswer ? console.log("correct") : console.log("not correct")
    onClick();
  }

  let borderClass = "border-2";

  if (hasAnswered) {
    borderClass = isAnswer
      ? "border-2 border-green-500"
      : "border-2 border-red-600"
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