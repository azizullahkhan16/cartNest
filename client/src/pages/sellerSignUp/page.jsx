import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { BsThreeDots } from "react-icons/bs";
const Login = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [store, setStore] = useState("");
  const [storeDesp, setStoreDesp] = useState("");
  const [storeType, setStoreType] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setAlert("");

    if (!firstName || !lastName || !phone || !address || !email || !password) {
      setAlert("please provide all information");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/signup/seller", {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        store,
        storeType,
        storeDesp,
      });
      navigate("/seller/login", { replace: true });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setAlert(error.response.data?.msg);
        } else {
          setAlert("server error");
        }
      } else if (error.request) {
        setAlert("no server response");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full  min-h-[calc(100vh-64px)] flex justify-center items-center">
        <div className="font-nunito w-full flex flex-col items-center space-y-3 my-3 mx-4 max-w-xl p-6 rounded-xl border shadow-xl shadow-zinc-300">
          <h1 className="text-2xl text-primary font-bold">Seller Sign Up</h1>

          <form
            onSubmit={handlesubmit}
            className="mx-auto w-full flex flex-col space-y-2 max-w-sm text-lg  font-light"
          >
            <div className="flex justify-center gap-2 my-2 ">
              <div>
                <label htmlFor="firstname" className="font-bold px-1">
                  First name :
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  id="firstname"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  className="w-full  px-3 py-1 rounded-full outline-none border shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="lastname" className="font-bold px-1">
                  Last name :
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  className="w-full  px-3 py-1 rounded-full outline-none border shadow-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="font-bold px-1 ">
                phone :
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                className="w-full  px-3 py-1 my-2 rounded-full outline-none border shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="font-bold px-1 ">
                address :
              </label>
              <input
                type="address"
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                className="w-full  px-3 py-1 my-2 rounded-full outline-none border shadow-sm"
              />
            </div>
            <div className="flex justify-center gap-2 my-2 ">
              <div>
                <label htmlFor="store" className="font-bold px-1">
                  Store name :
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  id="store"
                  value={store}
                  onChange={(e) => {
                    setStore(e.target.value);
                  }}
                  className="w-full  px-3 py-1 rounded-full outline-none border shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="storeType" className="font-bold px-1">
                  Store type:
                </label>
                <select
                  id="storeType"
                  value={storeType}
                  onChange={(e) => {
                    setStoreType(e.target.value);
                  }}
                  className="w-full px-3 py-1 rounded-full outline-none border shadow-sm"
                >
                  <option value="none">None</option>
                  <option value="clothing">Clothing</option>
                  <option value="beauty">Beauty and Personal Care</option>
                  <option value="electronics">Electronics</option>
                  <option value="garden">Home and Garden</option>
                  <option value="health">Health and Wellness</option>
                  <option value="sports">Sports and Outdoors</option>
                  <option value="baby">Baby and Kids</option>
                  <option value="food">Food and Beverages</option>
                  <option value="automotive">Automotive</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="storeDesp" className="font-bold px-1">
                Store Description:
              </label>
              <textarea
                id="storeDesp"
                value={storeDesp}
                onChange={(e) => {
                  setStoreDesp(e.target.value);
                }}
                className="w-full px-3 py-1 my-2 rounded outline-none border shadow-sm"
                rows="4" // You can adjust the number of rows as needed
              ></textarea>
            </div>
            <div>
              <label htmlFor="email" className="font-bold px-1">
                email :
              </label>
              <input
                type="email"
                autoComplete="off"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full  px-3 py-1 my-2 rounded-full outline-none border shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="font-bold px-1 ">
                password :
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full  px-3 py-1 my-2 rounded-full outline-none border shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className={`font-bold px-1 ${
                  confirmPassword
                    ? confirmPassword === password
                      ? "text-green-600"
                      : "text-red-600"
                    : ""
                }`}
              >
                confirm password :{" "}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                className="w-full  px-3 py-1 my-2 rounded-full outline-none border shadow-sm"
              />
              <div className="h-8">
                <p className="text-red-500 mb-2">{alert}</p>
              </div>
            </div>
            <button className="mx-auto inline-block px-6 py-1 border-2 text-primary font-semibold border-primary rounded-full hover:px-7 transition-all duration-200 cursor-pointer">
              {loading ? <BsThreeDots className="text-3xl" /> : "Sign up"}
            </button>
          </form>
          <div>
            <p className="inline-block">already have an account?</p>
            <Link to={"/seller/login"} className="underline inline-block ml-3">
              login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
