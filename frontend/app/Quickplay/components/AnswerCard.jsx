import React from "react";

export default function AnswerCard({ index, title, isAnswer }) {

  return (
    <section className="">
      <div className="flex-row hover:text-teal-500 transition ease-in-out duration-200 cursor-pointer bg-neutral-800 border-1 rounded-sm w-full h-28 items-center justify-center flex ">
        <p>{index}</p>
      </div>

    </section>
  )
}