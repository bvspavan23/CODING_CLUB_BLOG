import React from "react";
import "../Head/Head.css";
import Sample from "../../assets/Sample.mp4";
import { Typewriter } from "react-simple-typewriter"; // Updated import
import Carousel from "../carousel/carousel.jsx";
import Footer from "../Footer/Footer.jsx";

const Head = () => {
  return (
    <div>
      <div className="main">
        <video autoPlay muted loop src={Sample} className="botvideo"></video>
        <div className="content1 flex flex-col space-x-4 md:space-x-2">
          <h3 className="md:m-12 text-6xl md:text-8xl">
            Hola! <i>Coders</i>
          </h3>
          <span>
            <h3 className="mt-12 md:m-12 text-6xl md:text-8xl">
              learn
              <span>
                <Typewriter
                  words={[" Java", " Python", " C++", " React js"]} // Words to type
                  loop={true} // Infinite loop
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </span>
            </h3>
          </span>
        </div>
      </div>
      <div className="slides">
        <Carousel />
      </div>
      <Footer />
    </div>
  );
};

export default Head;