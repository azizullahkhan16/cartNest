import { useState } from "react";
import prodPlaceholder from "../../assets/images/prodPlaceholder.jpg";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { BsThreeDots } from "react-icons/bs";
const serverUrl = process.env.REACT_APP_URL;

const CartItem = ({ el, setData, count }) => {
  const privateAxios = usePrivateAxios();
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [quantity, setQuantity] = useState(count); // Initial quantity is set to 1

  const handleRemove = async () => {
    const id = el.product_id;
    setLoadingRemove(true);
    try {
      const res = await privateAxios.post("/user/removefromcart", {
        id,
        refresh: true,
      });
      console.log(res.data);
      setData(res.data);
    } catch (err) {
      console.log("err:" + err.message);
      setLoadingRemove(false);
    }
  };

  const handleAdd = async () => {
    // Check if the quantity is less than the available stock before incrementing
    if (quantity < el.stock || el.stock === -1) {
      try {
        setQuantity(quantity + 1);
        const res = await privateAxios.post("/user/updatecount", {
          id: el.product_id,
          count: quantity + 1,
          refresh: true,
        });
        setData(res.data);
      } catch (error) {
        console.log("err:" + error.message);
      }
    }
  };

  const handleSubtract = async () => {
    // Check if the quantity is greater than 1 before decrementing
    if (quantity > 1) {
      try {
        setQuantity(quantity - 1);
        const res = await privateAxios.post("/user/updatecount", {
          id: el.product_id,
          count: quantity - 1,
          refresh: true,
        });
        setData(res.data);
      } catch (error) {
        console.log("err:" + error.message);
      }
    }
  };

  return (
    <div className="w-full border p-3 my-4 hyphens-auto">
      {/* <h2 className="text-lg font-semibold md:hidden"> {el.name}</h2> */}
      <div className="flex  flex-row flex-wrap  gap-3 items-stretch mb-3">
        <img
          src={require(`../../../../images/${el.image}`)}
          alt=""
          className="border self-center aspect-square w-36 mx-auto"
        />
        <div className="grow flex gap-3 justify-between items-center min-w-[250px]">
          <div className="min-w-[135px] h-full md:min-w-[256px] w-min grow ">
            <div className=" mb-2 ">
              <h2 className="w-full text-lg font-semibold break-words block">
                {" "}
                {el.name}
              </h2>
              <div className="text-center w-fit ">
                {el.stock !== 0 ? (
                  <p className="bg-green-500 text-white text-sm inline-block px-1 rounded">
                    Available
                  </p>
                ) : (
                  <p className="bg-red-500 text-white text-sm inline-block px-1 rounded">
                    Not Available
                  </p>
                )}
                <p className=" ml-2 text-sm inline-block">
                  {el.stock >= 0 ? el.stock + " left" : "always"}
                </p>
              </div>
            </div>

            <p>{el.description}</p>
            <div className="w-32 flex items-center justify-between">
              <button
                className="w-8 h-8 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-md"
                onClick={handleSubtract}
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                className="w-8 h-8 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-md"
                onClick={handleAdd}
              >
                +
              </button>
            </div>
          </div>
          <p className="self-start text-primary">{`$${(el.price / 100).toFixed(
            2
          )}`}</p>
        </div>
      </div>
      {/* <div className=' w-full mx-auto flex flex-wrap justify-center items-center gap-2'> */}
      <div className=" w-full ">
        <button
          className="w-32 h-8 ml-auto flex items-center justify-center bg-zinc-200 hover:bg-slate-300 p-1 rounded-md "
          onClick={handleRemove}
        >
          {loadingRemove ? <BsThreeDots className="text-2xl" /> : "Remove"}
        </button>
        {/* <button className='w-32 h-8 inline-flex items-center justify-center bg-zinc-200 hover:bg-slate-300 p-1 rounded-md '>Edit</button> */}
      </div>
    </div>
  );
};

export default CartItem;
