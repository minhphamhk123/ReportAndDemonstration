import React from "react";

export function Info({ open, title, message }) {
  if (!open) {
    return null;
  }
  return (
    <div
      class="z-20 fixed left-1/2 transform -translate-x-1/2 w-1/3 h-min bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
      role="alert"
    >
      <div class="flex">
        <div class="py-1">
          <svg
            class="fill-current h-6 w-6 text-teal-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        </div>
        <div>
          <p class="font-bold">{title}</p>
          <p class="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
export function Danger({ open, message }) {
  if (!open) {
    return null;
  }
  return (
    <div
      className="z-20 fixed left-1/2 transform -translate-x-1/2 w-1/3 h-min"
      role="alert"
    >
      <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
        Danger
      </div>
      <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
        <p>{message}</p>
      </div>
    </div>
  );
}
export function Warning({ open, message }) {
  if (!open) {
    return null;
  }
  return (
    <div
      class="z-20 fixed left-1/2 transform -translate-x-1/2 w-1/3 h-min bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
      role="alert"
    >
      <p class="font-bold">Warning</p>
      <p>{message}</p>
    </div>
  );
}
