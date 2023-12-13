import { AiOutlineReload } from "react-icons/ai";
import { Link } from "react-router-dom";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import useGetAxios from "../../hooks/useGetAxios";
import LoadingThreeDots from "../../components/LoadingThreeDots";

const SellerOrders = () => {
  const privateaxios = usePrivateAxios();
  const { data, loading, error } = useGetAxios(
    "/seller/orders",
    privateaxios,
    []
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600"; // or any other classes for pending status
      case "Processing":
        return "text-blue-600"; // or any other classes for processing status
      case "Shipping":
        return "text-green-600"; // or any other classes for shipping status
      case "Completed":
        return "text-gray-600"; // or any other classes for completed status
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      {error ? (
        <p className="text-lg text-red-500 "> {error}</p>
      ) : loading ? (
        <LoadingThreeDots />
      ) : (
        data && (
          <div className="grow mx-auto max-w-6xl px-4 py-10  ">
            <div className="flex justify-between">
              <h1 className="text-2xl text-primary">orders:</h1>
              <button className="flex items-center px-5 rounded-lg text-lg text-green-400 hover:bg-green-400 hover:text-white">
                Reload
                <AiOutlineReload className="ml-2" />
              </button>
            </div>
            <p className="font-semibold text-lg mt-3">
              New: <span className="text-primary">{data.length}</span>
            </p>
            <div className="mt-3  max-w-lg flex-wrap flex items-center justify-between gap-4 text-zinc-600">
              <p>pending: {data.length}</p>
              <p>processing: {`0`}</p>
              <p>shipping: {`0`}</p>
              <p>completed: {`0`}</p>
            </div>

            <div className="grid w-full mt-5 rounded-xl overflow-hidden shadow-md border">
              <div className="w-full overflow-x-scroll  noscrollbar top-0 left-0">
                <table className="w-full px-2 min-w-max text-left">
                  <thead className="border-b text-lg">
                    <tr>
                      <th className="p-3 font-medium">order num</th>
                      <th className="p-3 font-medium">status</th>
                      <th className="p-3 font-medium">total</th>
                      <th className="p-3 font-medium">placed in</th>
                      <th className="p-3 font-medium">shipping to</th>
                      <th className="p-3 font-medium">total items</th>
                      <th className="p-3 font-medium">view</th>
                    </tr>
                  </thead>
                  <tbody className="[&>*:not(last-child)]:border-b">
                    {data.map((order) => (
                      <tr key={order.order_id}>
                        <td className="p-3 text-primary">
                          #{order.order_item_id}
                        </td>
                        <td className={`p-3 ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </td>
                        <td className="p-3 font-semibold">
                          ${(order.total_price / 100).toFixed(2)}
                        </td>
                        <td className="p-3 text-zinc-600">
                          {order.order_date}
                        </td>
                        <td className="p-3 text-zinc-600">
                          {order.shipping_address}
                        </td>
                        <td className="p-3">{order.quantity}</td>
                        <td className="p-3">
                          <Link
                            to={`/seller/orders/${order.order_id}`}
                            className="py-3 text-blue-500 hover:text-primary"
                          >
                            {`View >`}
                          </Link>
                        </td>
                      </tr>
                    ))}
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

export default SellerOrders;
