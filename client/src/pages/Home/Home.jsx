import Hero from "./Hero";
import HorizontalScroller from "./HorizontalScroller";
import CategoriesSection from "./CategoriesSection";

const Home = () => {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <HorizontalScroller category={"Apparel and Fashion"} />
      <HorizontalScroller category={"Home and Garden"} />
      <HorizontalScroller category={"Automotive"} />

      {/* <SearchBar /> */}
    </>
  );
};

export default Home;
