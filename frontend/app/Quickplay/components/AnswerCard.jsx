import React from "react";

export default function AnswerCard({ index, title, isAnswer, disabled, onClick }) {

  const checkAnswer = () => {
    isAnswer ? console.log("correct") : console.log("not correct")
    onClick();
  }
  return (
    <section className="">
      <div className="flex-row hover:text-teal-500 transition ease-in-out duration-200
      cursor-pointer bg-neutral-800 border-1 rounded-sm w-full h-28 items-center justify-center flex "
        onClick={checkAnswer}
      >
        <p className="p-5">{title}</p>
      </div>

    </section>
  )
}