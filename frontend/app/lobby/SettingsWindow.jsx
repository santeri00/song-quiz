import { X } from "lucide-react";
import React from "react";
export default function SettingsWindow({ onClose, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center  backdrop-blur-xs"
      onClick={onClose}
    >
      <div className="bg-neutral-900  rounded-md " onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-row items-center p-4 justify-between w-96">
          <h2 className="text-xl font-bold ">Settings</h2>
          <X className=" cursor-pointer" onClick={onClose} />
        </div>
        <div className="bg-neutral-800 w-auto p-4">
          <span>Rounds</span>
          <select className="bg-neutral-700 p-2 rounded-md w-full mt-2">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>


    </div>
  )

}