import React from "react";

export default function Background() {
  return (
    <div className="fixed h-full w-full overflow-hidden z-0">
      <div className="flex justify-center items-center left-[-200px] top-[-200px] md:left-[-300px] md:top-[-300px] lg:left-[-400px] lg:top-[-400px] xl:left-[-500px] xl:top-[-500px] w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] xl:w-[1000px] xl:h-[1000px] absolute">
        <div className="w-full h-full bg-center opacity-25 bg-emerald-300 rounded-full absolute" />
        <div className="w-4/5 h-4/5 opacity-50 bg-emerald-300 rounded-full absolute" />
        <div className="w-3/5 h-3/5 bg-emerald-300 rounded-full absolute" />
      </div>
      <div className="flex justify-center items-center right-[-200px] bottom-[-200px] md:right-[-300px] md:bottom-[-300px] lg:right-[-400px] lg:bottom-[-400px] xl:right-[-500px] xl:bottom-[-500px] w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] xl:w-[1000px] xl:h-[1000px] absolute">
        <div className="w-full h-full bg-center opacity-25 bg-emerald-300 rounded-full absolute" />
        <div className="w-4/5 h-4/5 opacity-50 bg-emerald-300 rounded-full absolute" />
        <div className="w-3/5 h-3/5 bg-emerald-300 rounded-full absolute" />
      </div>
    </div>
  );
}
