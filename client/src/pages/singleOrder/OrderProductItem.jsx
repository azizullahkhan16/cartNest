import prodPlaceholder from "../../assets/images/prodPlaceholder.jpg";
const OrderProductItem = ({ product }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 py-4 max-w-2xl ">
      <div className="grow flex flex-nowrap  gap-4 items-center  font-semibold font-nunito">
        <img
          src={require(`../../../../images/${product.image}`)}
          alt=""
          className="w-28 object-cover shadow-zinc-400 shadow-md aspect-[5/5] rounded-md"
        />

        <div className=" flex flex-col py-4 items-start self-stretch min-w-[200px]">
          <h2 className="font-semibold text-lg">{product.name}</h2>
        </div>
      </div>

      <div className="grow w-fit sm:w-auto flex justify-between gap-4">
        <p className="">${(product.unit_price / 100).toFixed(2)}</p>
        <p className="">x{product.quantity}</p>
        <p className="">${(product.total_price / 100).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderProductItem;
