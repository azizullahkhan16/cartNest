import { AiOutlineHeart, AiFillHeart, AiOutlineStar } from "react-icons/ai";
import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import prodPlaceholder from "../assets/images/prodPlaceholder.jpg";
import usePrivateAxios from "../hooks/usePrivateAxios";
import useAuth from "../hooks/useAuth";
const serverUrl = process.env.REACT_APP_URL;

const ProductCard = ({ data }) => {
  const { auth, setAuth } = useAuth();
  const inWishlist = useMemo(
    () => auth?.userData?.wishlist?.includes(data?.product_id),
    [auth, data]
  );
  const Location = useLocation();
  const Navigate = useNavigate();
  const privateAxios = usePrivateAxios();
  console.log("product card rerender");

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    if (!auth?.accessToken) {
      Navigate("/login", { state: { from: Location } });
      return;
    }
    try {
      // Initialize wishlist as an empty array if it's undefined
      const newWishlist = [...(auth.userData.wishlist || [])];

      if (!inWishlist) {
        await privateAxios.post("/user/addtowishlist", {
          id: data?.product_id,
        });
        newWishlist.push(data?.product_id);
      } else {
        await privateAxios.post("/user/removefromwishlist", {
          id: data?.product_id,
        });
        newWishlist.splice(newWishlist.indexOf(data?.product_id), 1);
      }

      const authWithEditedWishlist = {
        ...auth,
        userData: { ...auth.userData, wishlist: newWishlist },
      };
      setAuth(authWithEditedWishlist);
      console.log(authWithEditedWishlist);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Link to={"/products/" + data.product_id}>
      <div className="border  max-w-xs md:max-w-sm mx-auto w-full font-nunito flex flex-col rounded-lg shadow-lg p-2 md:p-4 gap-2 scale-100  hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="w-full aspect-square rounded-lg overflow-clip">
          <img
            src={require(`../../../images/${data.image}`)}
            alt="product img"
            className="h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="w-full flex flex-col  gap-1 md:gap-2">
          <div className="h-14 flex items-center space-x-2  justify-between ">
            <h3 className=" md:text-xl grow text-ellipsis line-clamp-2">
              {data.name}{" "}
            </h3>
            <div className="text-primary">
              <p className="text-xs md:text-sm font-bold">
                {" "}
                {(data.price / 100).toFixed(2)}$
              </p>
            </div>
          </div>
          <div className="flex items-center text-xl md:text-2xl justify-between z-10">
            <div className="text-lg  md:text-xl flex items-center">
              <AiOutlineStar className="mr-2" />
              <p className="text-base">{data.rating}</p>
            </div>
            {/* <button className='outline-none  hover:text-primary'><AiOutlineShoppingCart /></button> */}
            <button
              className={`outline-none hover:text-primary ${
                inWishlist ? "text-primary" : ""
              }`}
              onClick={handleAddToWishlist}
            >
              {inWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
