import React from "react";
import Background from "../../components/common/Background";
import LetterIcon from "../../common/images/letter_icon.png";

export default function Verified() {
  return (
    <div className="z-0 fixed w-full h-full">
      <Background />
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col items-center gap-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-14 h-14 md:w-20 md:h-20 p-2 md:p-3 rounded-xl shadow-2xl border text-emerald-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="text-center align-center text-2xl md:text-3xl font-bold ">
            Email verified
          </p>
          <p className="text-center font-semibold">
            <text className="block">
              Your email has been successfully verify.
            </text>
            <text className="block">Click bellow to go to Home page</text>
          </p>
          <button className="bg-emerald-400 text-white p-3 rounded-2xl uppercase hover:opacity-90 px-10 font-semibold">
            Continue
          </button>
          <p className="gap-2 flex justify-center items-center text-center text-gray-500 hover:cursor-pointer bg-red-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 inline-block font-bold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <text className="inline-block">Back to login</text>
          </p>
        </div>
      </div>
    </div>
  );
}
