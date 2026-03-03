import React from "react";

export default function QuestionCard({ Question }) {

  return (
    <section className="flex-row text-xl transition ease-in-out duration-200 bg-neutral-900 border-1 rounded-sm w-full h-50 items-center justify-center flex mt-10">
      <div>
        <p>{Question}</p>
      </div>

    </section>
  )
}