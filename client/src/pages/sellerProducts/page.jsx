import prodPlaceholder from "../../assets/images/prodPlaceholder.jpg";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import useGetAxios from "../../hooks/useGetAxios";
import LoadingThreeDots from "../../components/LoadingThreeDots";

const SellerProducts = () => {
  const privateaxios = usePrivateAxios();
  const { data, loading, error } = useGetAxios(
    "/seller/products",
    privateaxios,
    []
  );

  console.log(data);

  return (
    <>
      {error ? (
        <p className="text-lg text-red-500 "> {error}</p>
      ) : loading ? (
        <LoadingThreeDots />
      ) : (
        data && (
          <div className="grow min-h-screen px-2 sm:px-6 py-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-primary">
                Your Products:{" "}
                <span className="text-green-300">{data.length}</span>
              </h1>
              <Link
                to="/seller/addproduct"
                className=" flex items-center py-1 px-3 mr-6 text-zinc-600 text-lg border hover:border-primary rounded hover:text-primary"
              >
                <span className="mr-2">Add Product</span> <FaPlus />
              </Link>
            </div>

            <div className="grid w-full mt-5 min-w-0 rounded-xl overflow-hidden shadow-md border">
              <div className="w-full overflow-x-auto noscrollbar">
                <table className="w-full min-w-max text-left">
                  <thead className="border-b text-lg">
                    <tr>
                      <th scope="col" className="p-3 font-medium">
                        Product
                      </th>
                      <th scope="col" className="p-3 font-medium">
                        Selling For
                      </th>
                      <th scope="col" className="p-3 font-medium">
                        Stock
                      </th>
                      <th scope="col" className="p-3 font-medium">
                        Units Sold
                      </th>
                      <th scope="col" className="p-3 font-medium">
                        Go To
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&>*:not(last-child)]:border-b">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center p-3 text-lg">
                          Loading ...
                        </td>
                      </tr>
                    ) : data?.length > 0 ? (
                      data.map((el, idx) => (
                        <tr key={idx}>
                          <td className="p-3">
                            <div className="flex items-center">
                              <img
                                src={
                                  el.image
                                    ? require(`../../../../images/${el.image}`)
                                    : prodPlaceholder
                                }
                                alt="product img"
                                className="w-16 h-16 aspect-square object-cover rounded"
                              />
                              <p className="text-base ml-2 max-w-[150px]">
                                {el.name}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">{`$${(el.price / 100).toFixed(
                            2
                          )}`}</td>
                          <td className="p-3">
                            <div className="text-center w-fit">
                              {el.stock !== 0 ? (
                                <p
                                  className={`bg-${
                                    el.stock >= 0 ? "green" : "red"
                                  }-400 text-white text-sm px-1 rounded`}
                                >
                                  {el.stock >= 0
                                    ? "Available"
                                    : "Not Available"}
                                </p>
                              ) : (
                                <p className="text-sm">always</p>
                              )}
                              <p className="">
                                {el.stock >= 0 ? el.stock : "always"}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">{el.sold}</td>
                          <td className="p-3">
                            <Link
                              to={`/seller/products/${el.product_id}`}
                              className="text-blue-700 py-4"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center p-3 text-lg">
                          No products
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default SellerProducts;
