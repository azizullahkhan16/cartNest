import { useEffect, useMemo, useState } from "react";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineStar,
} from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import prodPlaceholder from "../../assets/images/prodPlaceholder.jpg";
import axios from "../../api/axios";
import useGetAxios from "../../hooks/useGetAxios";
import { useLocation, useParams } from "react-router-dom";
import LoadingThreeDots from "../../components/LoadingThreeDots";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import usePrivateAxios from "../../hooks/usePrivateAxios";

const serverUrl = process.env.REACT_APP_URL;

const ProductPage = () => {
  const { id } = useParams();
  const { auth, setAuth } = useAuth();
  const privateAxios = usePrivateAxios();
  const Navigate = useNavigate();
  const Location = useLocation();

  const [img, setImg] = useState(0);
  const [alert, setAlert] = useState("");
  const { data, loading, error } = useGetAxios(`/products/${id}`, axios, []);
  const [cartButtonLoading, setCartButtonLoading] = useState(false);
  const [wishlistButtonLoading, setWishlistButtonLoading] = useState(false);
  console.log(data);

  const inWishlist = useMemo(
    () => auth?.userData?.wishlist?.includes(data?.product_id),
    [auth, data]
  );
  const inCart = useMemo(
    () => auth?.userData?.cart?.map((el) => el.id).includes(data?.product_id),
    [auth, data]
  );
  console.log(inCart);

  const handleAddToCart = async () => {
    //navigate to login page if not authenticated
    if (!auth.accessToken) {
      Navigate("/login", { state: { from: Location } });
      return;
    }

    try {
      setAlert("");
      setCartButtonLoading(true);
      const item = { id: data?.product_id };
      console.log(item);
      const newCart = [...auth.userData.cart];
      //change the behaviour of the function to (add to cart ) or (remove from cart) according to state
      if (!inCart) {
        await privateAxios.post("/user/addtocart", { item });
        newCart.push(item);
      } else {
        await privateAxios.post("/user/removefromcart", {
          id: data.product_id,
        });
        newCart.splice(
          newCart.findIndex((el) => el.id === data.product_id),
          1
        );
      }
      const authWithEditedCart = {
        ...auth,
        userData: { ...auth.userData, cart: newCart },
      };
      setAuth(authWithEditedCart);
    } catch (error) {
      if (error.response) {
        setAlert(
          error.response.data?.msg
            ? error.response.data?.msg
            : "something went wrong"
        );
      } else if (error.request && error.message !== "canceled") {
        setAlert("no server response");
      }
    }
    setCartButtonLoading(false);
  };

  const handleAddToWishlist = async () => {
    if (!auth.accessToken) {
      Navigate("/login", { state: { from: Location } });
      return;
    }

    try {
      setAlert("");
      setWishlistButtonLoading(true);
      const newWishlist = [...auth.userData.wishlist];
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
      if (error.response) {
        setAlert(
          error.response.data?.msg
            ? error.response.data?.msg
            : "something went wrong"
        );
      } else if (error.request && error.message !== "canceled") {
        setAlert("no server response");
      }
    }
    setWishlistButtonLoading(false);
  };

  return (
    <>
      {error && <p className="text-lg text-center text-red-500">{error}</p>}
      {loading ? (
        <LoadingThreeDots />
      ) : data ? (
        <div className="flex items-center justify-center py-5 min-h-[calc(100vh-64px)] ">
          <div className="flex flex-col w-full md:flex-row gap-4 max-w-6xl px-4 mx-auto items-stretch font-nunito">
            {/* image section */}

            <div className="flex justify-center items-center w-full md:w-1/3  shrink-0 shadow ]  ">
              <div className="p-4 w-full max-w-md">
                <img
                  src={
                    data.image
                      ? require(`../../../../images/${data.image}`)
                      : prodPlaceholder
                  }
                  alt=""
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>

            {/* details section */}
            <div className=" grow p-4 w-full">
              <h1 className="text-2xl  font-semibold ">{data.name}</h1>

              {/* <p className='mt-2 text-green-400 text-lg'>in stock</p> */}
              <div>
                {data.stock !== 0 ? (
                  <p className="mt-2 w-fit px-2 rounded bg-green-500 text-white  text-lg inline-block">
                    in stock
                  </p>
                ) : (
                  <p className="mt-2 w-fit px-2 rounded bg-red-500 text-white  text-lg inline-block">
                    out of stock
                  </p>
                )}
                {data.stock >= 0 ? (
                  <p className="mt-2 text-lg inline-block ml-2">{data.stock}</p>
                ) : (
                  <p className="mt-2 text-lg inline-block ml-2">always</p>
                )}
              </div>

              <div className="mt-2 flex items-center text-xl font font-nunito text-primary">
                <AiOutlineStar className="inline-block mr-2" />
                <p className="inline-block">{data.rating}</p>
              </div>

              <div className="mt-2 flex items-center space-x-3">
                <p className="text-xl  ">{data.price / 100}$</p>
              </div>
              {/* description */}
              <p className="mt-4 "> {data.description} </p>
              {/* specifications */}
              <div className="mt-4">
                {data.specifications?.map((el, idx) => {
                  return (
                    <p className="mt-1" key={idx}>
                      - {el}
                    </p>
                  );
                })}
              </div>
              {alert && <p className="text-red-500 mb-2">{alert}</p>}
              {/* Buttons */}
              <div className="min-w-min flex flex-wrap justify-start gap-2">
                <button
                  className="outline-none w-52 h-8 py-1 px-1 flex items-center justify-center gap-2 rounded-md hover:opacity-90 text-white  bg-primary"
                  onClick={handleAddToCart}
                >
                  <AiOutlineShoppingCart className="w-fit" />
                  {cartButtonLoading ? (
                    <BsThreeDots />
                  ) : inCart ? (
                    <span>Remove from cart</span>
                  ) : (
                    <span>Add to cart</span>
                  )}{" "}
                </button>
                <button
                  className="outline-none w-52 h-8 py-1 px-1 flex items-center justify-center gap-2 rounded-md hover:opacity-80 text-primary border border-primary box-border"
                  onClick={handleAddToWishlist}
                >
                  <AiOutlineHeart className="w-fit" />{" "}
                  {wishlistButtonLoading ? (
                    <BsThreeDots />
                  ) : inWishlist ? (
                    <span>Remove from wishlist</span>
                  ) : (
                    <span>Add to wishlist</span>
                  )}{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-[calc(100vh-64px)] justify-center items-center">
          <p className="text-xl text-primary font-semibold">
            Product doesn't exist !
          </p>
        </div>
      )}
    </>
  );
};

export default ProductPage;
