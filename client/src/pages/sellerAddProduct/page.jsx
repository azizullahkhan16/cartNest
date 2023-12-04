import { useState } from "react";
import categs from "../../Categories";
import { AiFillCloseCircle, AiOutlineCheck } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import usePrivateAxios from "../../hooks/usePrivateAxios";
// import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [priceCents, setPriceCents] = useState(0);
  const [stock, setStock] = useState(0);
  const [alwAvail, setAlwAvail] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // Change to single category
  const [opencategs, setOpenCategs] = useState(false);
  const [image, setImage] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const privateaxios = usePrivateAxios();
  const navigate = useNavigate();

  // Simplified handleAddImage function to set the image directly
  const handleAddImage = (e) => {
    if (e.target.files[0]) {
      const img = e.target.files[0];
      setImage(img); // Set the image directly
    }
  };

  // Updated rendering of selected categories
  const renderSelectedCategories = () => {
    return (
      <div className="flex flex-wrap gap-2 border rounded-md px-2 py-1">
        {category ? (
          <div className="py-1 px-2 border border-zinc-400 rounded-full flex items-center">
            <p className="mr-2">{category} </p>
            <span
              className="text-red-500 text-xl cursor-pointer"
              onClick={() => {
                setCategory("");
              }}
            >
              <AiFillCloseCircle />
            </span>
          </div>
        ) : (
          <p>No category</p>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const prodPrice = price * 100 + priceCents;
      if (!name || prodPrice === 0 || !category) {
        setAlert("Please provide all necessary data");
        return;
      }
      const stockCount = alwAvail ? -1 : stock;
      setLoading(true);
      const productData = JSON.stringify({
        name,
        price: prodPrice,
        stock: stockCount,
        description,
        category,
      });

      const f = new FormData();
      if (image) {
        f.append("image", image);
      }
      f.append("productData", productData);

      const response = await privateaxios.post("/seller/addproduct", f, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        setAdded(true);
        setTimeout(() => {
          navigate("/seller/products");
        }, 1000); // Adjust the delay time as needed
      }
    } catch (error) {
      if (error.response) {
        setAlert(
          error.response.data?.msg
            ? error.response.data?.msg
            : "Something went wrong"
        );
      } else if (error.request) {
        setAlert("No server response");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div className="grow bg-inc-50 min-h-screen px-2 sm:px-6 py-8 max-w-6xl mx-auto">
        <div className="py-2 px-4 border rounded-lg shadow-md">
          <h1 className="text-2xl text-primary">Add new product :</h1>
          <form className="mt-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="mt-4">
              <label htmlFor="name" className="block">
                Product Name:
              </label>
              <input
                type="text"
                autoComplete="off"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="outline-none bg-zinc-50 border px-2 py-1 text-lg rounded-lg w-full max-w-lg"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="" className="mr-2">
                Price:
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match("^\\d{0,5}$")) {
                    setPrice(value ? parseInt(value) : 0);
                  }
                }}
                className="outline-none bg-zinc-50 border px-1 text-lg rounded-lg w-16 max-w-lg"
              />
              <span className="mx-1 text-lg">.</span>
              <input
                type="text"
                value={priceCents}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match("^\\d{0,2}$")) {
                    setPriceCents(value ? parseInt(value) : 0);
                  }
                }}
                className="outline-none bg-zinc-50 border px-1 text-lg rounded-lg w-8 max-w-lg"
              />
              <span className="ml-4">
                {price}.
                {priceCents.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}{" "}
                $
              </span>
            </div>

            <div className="mt-4">
              <label htmlFor="" className="mr-2">
                Stock:
              </label>
              <input
                type="text"
                value={stock}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match("^\\d{0,5}$")) {
                    setStock(value ? parseInt(value) : 0);
                  }
                }}
                disabled={alwAvail}
                className="outline-none bg-zinc-50 border px-1 text-lg rounded-lg w-16 max-w-lg"
              />
              <input
                type="checkbox"
                id="alwaysavailable"
                className="ml-4"
                checked={alwAvail}
                onChange={(e) => {
                  setAlwAvail(e.target.checked);
                }}
              />
              <label
                htmlFor="alwaysavailable"
                className={`${alwAvail ? "text-green-600" : ""}`}
              >
                {" "}
                Always Available
              </label>
            </div>

            <div className="mt-4">
              <label htmlFor="description" className="block">
                Description:
              </label>
              <textarea
                name="description"
                id="description"
                rows={5}
                className="outline-none bg-zinc-50 border px-2 resize-none py-1 rounded-lg w-full max-w-lg"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>

            {/* Categories */}
            <div className="mt-5 w-full max-w-lg">
              <div className="flex items-center justify-between">
                <p className="text-lg">Category:</p>
                <button
                  type="button"
                  className="p-1 rounded-md flex items-center hover:text-green-500"
                  onClick={() => {
                    setOpenCategs(!opencategs);
                  }}
                >
                  <FaPlus className="text-green-500 mr-1" /> Add
                </button>
              </div>

              {opencategs && (
                <div className="p-2 my-2 rounded-lg border border-zinc-500 flex flex-wrap gap-2 w-full">
                  {categs.map((el, idx) => (
                    <div
                      key={idx}
                      className={`px-2 py-1 border rounded-full cursor-pointer ${
                        category === el.name
                          ? "border-green-600 text-green-600"
                          : "border-zinc-500"
                      }`}
                      onClick={() => {
                        setCategory(category === el.name ? "" : el.name);
                      }}
                    >
                      <p>{el.name}</p>
                    </div>
                  ))}
                </div>
              )}

              {renderSelectedCategories()}
            </div>

            {/* Images */}
            <div className="mt-5 w-full max-w-lg">
              <p className="text-xl mb-3">Images:</p>
              <div className="flex flex-wrap gap-4">
                {image && (
                  <div className="w-24 h-24  relative border rounded-md">
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 text-lg text-red-500"
                      onClick={() => {
                        setImage(null);
                      }}
                    >
                      <AiFillCloseCircle />
                    </button>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="product image"
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                )}

                {!image && (
                  <label
                    htmlFor="img"
                    className={`cursor-pointer ${image ? "hidden" : "block"}`}
                  >
                    <div className="w-24 h-24 rounded-md bg-zinc-200 flex items-center justify-center">
                      <FaPlus className="text-4xl text-zinc-400" />
                    </div>
                  </label>
                )}
                <input
                  type="file"
                  name="img"
                  id="img"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAddImage}
                />
              </div>
            </div>
            <p className="my-1 text-red-500">{alert}</p>

            <div className="w-full max-w-lg mt-5 mb-9">
              <button
                className={` block px-12 py-1 mx-auto border ${
                  added
                    ? "bg-green-500 text-white"
                    : "border-primary hover:bg-primary hover:text-white  text-primary"
                } rounded-md font-semibold text-xl`}
              >
                {added ? (
                  <AiOutlineCheck className="text-2xl" />
                ) : loading ? (
                  <BsThreeDots className="text-2xl" />
                ) : (
                  "Add"
                )}{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
