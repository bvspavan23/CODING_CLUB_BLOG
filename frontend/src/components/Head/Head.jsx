import React from "react";
import "../Head/Head.css";
import Sample from "../../assets/Sample.mp4";
import Typical from "react-typical";
import Carousel from "../carousel/carousel.jsx";
import Footer from "../Footer/Footer.jsx";
const Head = () => {
  let EvePics = [
    "https://i.pinimg.com/originals/51/82/ac/5182ac536727d576c78a9320ac62de30.jpg",
    "https://wallpapercave.com/wp/wp3386769.jpg",
    "https://wallpaperaccess.com/full/809523.jpg",
    "https://getwallpapers.com/wallpaper/full/5/c/0/606489.jpg",
  ];
  return (
    <div>
    <div className="main">
      <video autoPlay muted loop src={Sample} className="botvideo"></video>
      <div className="content1 flex flex-col space-x-4 md:space-x-2">
        <h3 className="md:m-12 text-6xl md:text-8xl">
          Hola! <i>Coders</i>
        </h3>
        <span>
          <h3 className="mt-12 md:m-12 text-6xl md:text-8xl">learn
            <span>
            <Typical
            steps={[
              " Java ",
              2000,
              " Python",
              2000,
              " C++",
              2000,
              " React js",
              2000,
            ]}
            loop={Infinity}
            wrapper="i"
          />
            </span>
        </h3>
        </span>
      </div>
    </div>
    <div className="slides">
      {/* <Slides/> */}
      <Carousel/>
    </div>
    <Footer/>
      </div>

  );
};
export default Head;
