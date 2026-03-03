import React from "react";
import Navbar from "../../components/Navbar";
import EndNavbar from "./EndNavBar";
import { CircleCheck, CircleX } from "lucide-react";
import ScoreBoard from "./ScoreBoard";
export default function MultiEndState({ players, user }) {

  const data = players.find(p => p.nickname === user);
  const history = data?.answerHistory || [];

  return (
    <section className="grid gap-5">
      <EndNavbar />


      <div className="text-center m-5 text-4xl">
        <h2>Total score: {data?.score}</h2>
      </div>

      <div className="flex flex-row justify-center gap-5">
        <div className="">
          <ScoreBoard user={user}
            players={players} />
        </div>
        <div className="rounded-sm overflow-hidden w-full max-w-120">
          <table className="w-full opacity-85">
            <thead className="bg-neutral-900">
              <tr>
                <th className="p-3 text-left">Round</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Score</th>
              </tr>
            </thead>

            <tbody>
              {history.map((track, index) => (
                <tr key={index} className="odd:bg-neutral-800 even:bg-neutral-900 " >
                  <td className="text-left p-3">{index + 1}</td>
                  <td className="text-left p-3">{track.song?.title}</td>
                  <td className="text-left p-3">{track.correct ? <CircleCheck className="text-green-500" /> : <CircleX className="text-red-500" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>


    </section>
  )
}