import React, { useEffect } from "react";
import "./About.css";
import Footer from "../Footer/Footer.jsx";
import group from "../../assets/group.jpg";
const AboutUs = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".animated-section");
      sections.forEach((section) => {
        const position = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (position < windowHeight - 100) {
          section.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <section className="hero">
        <img src={group} alt="Club Members" className="group-photo" />
      </section>

      <section className="animated-section" id="vision">
        <h2>Our Vision</h2>
        <p>To inspire and empower students through technology and collaboration.</p>
      </section>

      <section className="animated-section" id="mission">
        <h2>Our Mission</h2>
        <p>To provide a platform for students to learn, innovate, and showcase their skills.</p>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
