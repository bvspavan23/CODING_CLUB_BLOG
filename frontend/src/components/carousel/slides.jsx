import React, { useState, useEffect } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";

const Slides = ({ pics }) => {
  const [cbot, setCbot] = useState(0);

  // Function to move to the previous slide
  const previousSlide = () => {
    setCbot((prev) => (prev === 0 ? pics.length - 1 : prev - 1));
  };

  // Function to move to the next slide
  const nextSlide = () => {
    setCbot((prev) => (prev === pics.length - 1 ? 0 : prev + 1));
  };

  // Auto-slide effect every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [cbot]); // Depend on `cbot` to reset timer on slide change

  return (
    <div className="overflow-hidden relative">
      {/* Slide Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${cbot * 100}%)`,
        }}
      >
        {pics.map((bot, index) => (
          <img
            key={index}
            src={bot}
            alt="bot"
            className="transition-opacity duration-700 ease-in-out opacity-90 hover:opacity-100"
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-0 h-full w-full flex justify-between items-center text-white px-10 text-3xl">
        <button
          onClick={previousSlide}
          className="transition-transform duration-200 hover:scale-110"
        >
          <HiArrowNarrowLeft />
        </button>
        <button
          onClick={nextSlide}
          className="transition-transform duration-200 hover:scale-110"
        >
          <HiArrowNarrowRight />
        </button>
      </div>

      {/* Dots for Slide Navigation */}
      <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full">
        {pics.map((_, i) => (
          <div
            onClick={() => setCbot(i)}
            key={"circle" + i}
            className={`rounded-full w-3 h-3 cursor-pointer transition-all duration-300 ${
              i === cbot ? "bg-white scale-110" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slides;
