import { useEffect, useState } from "react";
import LoadingThreeDots from "../../components/LoadingThreeDots";
import { FiEdit } from "react-icons/fi";
import useGetAxios from "../../hooks/useGetAxios";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import prodPlaceholder from "../../assets/images/profilePlaceholder.png";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [changed, setChanged] = useState(false);
  const [img, setImg] = useState(null);
  const { setAuth } = useAuth();
  const [err, setErr] = useState("");
  const privateAxios = usePrivateAxios();
  const { data, loading, error } = useGetAxios(
    "/user/profile",
    privateAxios,
    []
  );
  console.log(data);
  useEffect(() => {
    if (data) {
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setPhone(data.phone);
      setAddress(data.address);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      if (
        data.first_name !== firstName ||
        data.last_name !== lastName ||
        data.phone !== phone ||
        data.address !== address
      ) {
        setChanged(true);
        console.log("data.phone " + data.phone);
      } else {
        setChanged(false);
      }
    }
  }, [firstName, lastName, phone, address]);

  const handleSetImage = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleImageSubmit = async () => {
    const f = new FormData();
    f.append("img", img);
    try {
      const res = await privateAxios.post("/user/updatepfp", f, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res) {
        setTimeout(() => {
          setAuth((p) => {
            return { ...p, userData: { ...p.userData, image: res.data.img } };
          });
        }, 1000);

        data.profilePicture = res.data.img;
        setImg(null);
      }
    } catch (e) {
      console.log("eeeee" + e);
      if (error.response) {
        // setAlert(error.response.data?.msg ? error.response.data?.msg : 'something went wrong')
      } else if (error.request) {
        // setAlert('no server response')
      }
    }
  };

  const handleUpdataInfo = async () => {
    if (firstName && lastName && phone && address) {
      const data = {
        firstName,
        lastName,
        phone,
        address,
      };
      try {
        await privateAxios.post("/user/updateinfo", data);
        setAuth((p) => {
          return { ...p, userData: { ...p.userData, address } };
        });
        setChanged(false);
        setErr("");
      } catch (error) {
        if (error.response) {
          setErr("something went wrong");
        } else if (error.request) {
          setErr("no server response");
        }
      }
    } else {
      return setErr("please provide a value");
    }
  };

  return (
    <>
      <div className="grow max-w-6xl mx-auto mb-10 px-3">
        {error ? (
          <div className="flex w-full h-[calc(100vh-64px)] justify-center items-center ">
            <p className="text-xl font font-semibold text-red-500">{error} </p>
          </div>
        ) : loading ? (
          <LoadingThreeDots />
        ) : (
          data && (
            <>
              <div className="p-6 border-b flex flex-col sm:flex-row items-center sm:items-end gap-0 sm:gap-6">
                <div className="relative flex flex-col items-center">
                  <label
                    htmlFor="img"
                    className="text-primary hover:text-blue-400  absolute top-2 right-2 cursor-pointer outline-none"
                  >
                    <FiEdit />
                  </label>
                  <input
                    type="file"
                    name="img"
                    id="img"
                    className="hidden"
                    accept="image/*"
                    onChange={handleSetImage}
                  />
                  <img
                    src={
                      data?.image
                        ? require(`../../../../images/${data?.image}`)
                        : { prodPlaceholder }
                    }
                    alt=""
                    className="aspect-square w-40 h-40 rounded-full object-cover"
                  />
                </div>
                <div>
                  {img && (
                    <div className="mt-1 mx-auto w-fit sm:w-auto">
                      <button
                        className="px-2 py-1 border border-primary text-primary text-xs rounded-full"
                        onClick={handleImageSubmit}
                      >
                        Submit
                      </button>
                      <button
                        className="px-2 py-1 border border-zinc-600 text-zinc-600 text-xs rounded-full ml-2"
                        onClick={() => {
                          setImg(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <p className="text-2xl font-semibold my-2 sm:my-6 ">
                    {" "}
                    {`${data.first_name} ${data.last_name}`}{" "}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-xl  font-nunito border-b">
                <div className="w-36 h-36 rounded-full mx-auto md:mx-0 flex flex-col items-center justify-center bg-gradient-to-b from-green-300 to bg-green-500 ">
                  <div className="w-32 h-32  py-2 px-4 bg-white rounded-full flex flex-col items-center justify-center">
                    <p>cart</p>
                    <p className="text-2xl text-primary">{data.cart?.length}</p>
                  </div>
                </div>
                <div className="w-36 h-36 rounded-full mx-auto md:mx-0 flex flex-col items-center justify-center bg-gradient-to-b from-red-300 to bg-red-500 ">
                  <div className="w-32 h-32  py-2 px-4 bg-white rounded-full flex flex-col items-center justify-center">
                    <p>wishlist</p>
                    <p className="text-2xl text-primary">
                      {data.wishlist?.length}
                    </p>
                  </div>
                </div>
                <div className="w-36 h-36 rounded-full mx-auto md:mx-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 to bg-blue-500 ">
                  <div className="w-32 h-32  py-2 px-4 bg-white rounded-full flex flex-col items-center justify-center">
                    <p>orders</p>
                    <p className="text-2xl text-primary">{data.totalorders}</p>
                  </div>
                </div>
                <div className="w-36 h-36 rounded-full mx-auto md:mx-0 flex flex-col items-center justify-center bg-gradient-to-b from-zinc-300 to bg-zinc-500 ">
                  <div className="w-32 h-32  py-2 px-4 bg-white rounded-full flex flex-col items-center justify-center">
                    <p>cart</p>
                    <p className="text-2xl text-primary">13</p>
                  </div>
                </div>
                {/* <div className='w-36 h-36 py-2 px-4 rounded-full mx-auto md:mx-0 flex flex-col items-center justify-center bg-slate-100 '>
            <p>cart</p>
            <p className='text-2xl text-primary'>13</p>
          </div>
          <div className='w-36 h-36 py-2 px-4 rounded-full mx-auto md:mx-0 flex flex-col items-center justify-center bg-slate-100 '>
            <p>wishlist</p>
            <p className='text-2xl text-primary'>18</p>
          </div>
          <div className='w-36 h-36 py-2 px-4 rounded-full mx-auto md:mx-0 flex flex-col items-center justify-center bg-slate-100 '>
            <p>orders</p>
            <p className='text-2xl text-primary'>3</p>
          </div>
          <div className='w-36 h-36 py-2 px-4 rounded-full mx-auto md:mx-0 flex flex-col items-center justify-center bg-slate-100 '>
          <p>completed orders</p>
            <p className='text-2xl text-primary'>23</p>
          </div> */}
              </div>

              <div className="mt-4 max-w-3xl text-zinc-700">
                <p className="text-lg w-fit">Personal Information</p>
                <div className="flex gap-4 flex-wrap mt-4">
                  <div className="grow min-w-[250px] ">
                    <label htmlFor="first name" className="block">
                      {" "}
                      First name:
                    </label>
                    <input
                      type="text"
                      id="first name"
                      className="outline-none border w-full rounded-lg bg-slate-100  p-2"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grow min-w-[250px]">
                    <label htmlFor="last name" className="block">
                      {" "}
                      Last name:
                    </label>
                    <input
                      type="text"
                      id="last name"
                      className="outline-none border w-full rounded-lg bg-slate-100  p-2"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grow min-w-[250px]">
                    <label htmlFor="phone number" className="block">
                      {" "}
                      Phone number:
                    </label>
                    <input
                      type="text"
                      id="phone number"
                      className="outline-none numberinput none border w-full rounded-lg bg-slate-100 p-2"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                    />
                  </div>
                  <div className="w-full min-w-[250px]">
                    <label htmlFor="adress" className="block">
                      Address:
                    </label>
                    <input
                      type="text"
                      id="adress"
                      className="outline-none numberinput none border w-full rounded-lg bg-slate-100 p-2"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="w-full max-w-3xl ">
                  <p className="text-red-500 ">{err}</p>
                  <button
                    className={`mt-4 mx-auto block rounded-md px-4 py-1  border font-semibold border-primary text-primary ${
                      changed ? "" : "hidden"
                    }`}
                    onClick={handleUpdataInfo}
                  >
                    Update
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </>
  );
};

export default Profile;
