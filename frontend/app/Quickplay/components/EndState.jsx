import React from "react";
import Navbar from "../../components/Navbar";
import { CircleCheck, CircleX } from "lucide-react";
export default function EndState({ trackList, score, scoreList }) {

  return (
    <section className="grid gap-5">
      <Navbar />

      <div className="text-center m-5 text-4xl">
        <h2>Total score: {score}</h2>
      </div>

      <div className="flex justify-center">
        <div className="rounded-sm overflow-hidden w-full max-w-2xl">
          <table className="w-full opacity-85">
            <thead className="bg-neutral-900">
              <tr>
                <th className="p-3 text-left">Round</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Score</th>
              </tr>
            </thead>

            <tbody>
              {scoreList.map((score, index) => (
                <tr key={index} className="odd:bg-neutral-800 even:bg-neutral-900 " >
                  <td className="text-left p-3">{index + 1}</td>
                  <td className="text-left p-3">{score.title}</td>
                  <td className="text-left p-3">{score.correct ? <CircleCheck className="text-green-500" /> : <CircleX className="text-red-500" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>


    </section>
  )
}