import React from "react";
import "../Head/Head.css";
import Sample from "../../assets/Sample.mp4";
import Video1 from "../../assets/video1.mp4";
// import Earth from "../../assets/fullearth.mp4"
import { Typewriter } from "react-simple-typewriter";
import Carousel from "../carousel/carousel.jsx";
import Footer from "../Footer/Footer.jsx";

const Head = () => {
  return (
    <div>
      <div className="main">
        <video autoPlay muted loop src={Video1} className="w-full h-full object-fill md:object-fill lg:object-cover absolute top-0 left-0 -z-10"></video>
      </div>
      <div className="slides">
        <Carousel />
      </div>
      <Footer />
    </div>
  );
};

export default Head;