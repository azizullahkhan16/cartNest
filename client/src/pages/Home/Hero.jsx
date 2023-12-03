import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
const Hero = () => {
  return (
    <div className="relative">
      <img
        src={require("../../assets/images/cover-8.jpg")} // Update the path accordingly
        alt="Background"
        className="w-full h-full object-cover object-center absolute inset-0"
      />

      <div className="relative md:w-5/6 lg:w-2/3 max-w-7xl pt-8 md:pt-16 pb-8 px-8 mx-auto z-10">
        <div className="flex flex-col-reverse gap-5 md:gap-0 md:flex-row justify-between items-end md:items-start md:pt-8">
          <div className="md:w-2/3 md:max-w-3xl text-white">
            <h1 className="text-5xl text-center md:text-left text-primary font-bold">
              CartNest: Your Shopping Sanctuary
            </h1>
            <p className="text-xl font-semibold text-center md:text-left text-zinc-800 my-7">
              Your curated destination for seamless shopping experiences.
              Explore, discover, and indulge in a world of convenience and
              choice, all within the comfort of your cart.
            </p>
          </div>

          <Link
            to={"/seller/login"}
            className="py-3 px-4 bg-gray-200 hover:bg-orange-300 rounded-xl"
          >
            I'm a seller
          </Link>
        </div>

        <div className="flex justify-center items-center mt-10">
          {/* Assuming SearchBar is a component or function that returns JSX */}
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Hero;
