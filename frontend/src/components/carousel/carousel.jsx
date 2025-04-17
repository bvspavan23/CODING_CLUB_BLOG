import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom"; 

const pics = [
  {
    title: "Hackathon",
    date: "March 15-16, 2025",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1470",
    description: "12-hours coding challenge with amazing prizes",
    link: "/event/eventinfo/Hack-A-Thon/1", 
  },
  {
    title: "Web Dev Workshop",
    date: "March 11-23, 2025",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1470",
    description: "Learn modern web development techniques",
    link: "/event/eventinfo/Web%20Development%20Workshop/2",
  },
  {
    title: "Code BUZZ",
    date: "April 23,2025",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1470",
    description: "Simple Quiz Game",
    link: "/event/eventinfo/Code%20Buzz/3",
  },
  {
    title: "AI/ML Workshop",
    date: "April 1-5, 2025",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1470",
    description: "Intensive machine learning training",
    link: "/event/eventinfo/AIML%20Workshop/4",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pics.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % pics.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + pics.length) % pics.length);
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Upcoming Events
        </motion.h2>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <motion.div
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex"
            >
              {pics.map((event, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0"
                  style={{ scrollSnapAlign: "start", cursor: "pointer" }} 
                >
                  <Link to={event.link}> 
                    <div className="relative h-[500px]">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-3xl font-bold mb-2">{event.title}</h3>
                        <p className="text-xl mb-2">{event.date}</p>
                        <p className="text-gray-300">{event.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center mt-6 space-x-2">
            {pics.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
