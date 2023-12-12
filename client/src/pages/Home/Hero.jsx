import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";
import SearchBar from "../../components/SearchBar";
import useAuth from "../../hooks/useAuth";

const Hero = () => {
  const { auth, setAuth } = useAuth();

  const [textIndex, setTextIndex] = useState(0);

  const texts = [
    "Discover Endless Choices",
    "Unleash Your Shopping Desire",
    "Explore Curated Experiences",
    "Transform Your Cart Journey",
  ];

  const [headingSpring, setHeadingSpring] = useSpring(() => ({
    from: { opacity: 0, transform: "translateY(-100%)" },
    to: { opacity: 1, transform: "translateY(0)" },
    reset: true, // Reset the animation when the 'to' value changes
    config: config.molasses, // Adjust the animation speed and tension
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the text index in a cyclic manner
      setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);

      // Trigger the animation reset when the text changes
      setHeadingSpring({
        from: { opacity: 0, transform: "translateY(-20px)" },
        to: { opacity: 1, transform: "translateY(0)" },
        reset: true,
        config: config.molasses,
      });
    }, 2000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [texts.length, setHeadingSpring]);

  return (
    <div className="relative">
      <img
        src={require("../../assets/images/cover-8.jpg")}
        alt="Background"
        className="w-full h-full object-cover object-center absolute inset-0"
      />

      <div className="relative md:w-5/6 lg:w-2/3 max-w-7xl pt-16 pb-8 px-8 mx-auto z-10">
        <div className="flex flex-col-reverse gap-5 md:gap-0 md:flex-row justify-between items-start">
          <div className="md:w-2/3 md:max-w-3xl text-white text-center md:text-left">
            <h1 className="text-5xl text-primary font-bold">
              <animated.span style={headingSpring}>
                {texts[textIndex]}
              </animated.span>
            </h1>
            <p className="text-xl font-semibold text-zinc-800 my-7">
              Your curated destination for seamless shopping experiences.
              Explore, discover, and indulge in a world of convenience and
              choice, all within the comfort of your cart.
            </p>
          </div>

          {auth?.role !== "user" && (
            <Link
              to={"/seller/login"}
              className="py-3 px-4 bg-gray-200 hover:bg-orange-300 rounded-xl inline-block"
            >
              I'm a seller
            </Link>
          )}
        </div>

        <div className="flex justify-left items-left mt-10">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Hero;
