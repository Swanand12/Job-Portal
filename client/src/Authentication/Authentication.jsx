import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { IoPerson, IoLockClosed, IoEye, IoEyeOff, IoChevronDown } from "react-icons/io5";
import { FaUserCog } from "react-icons/fa";

const Authentication = () => {
  const [isSignInActive, setIsSignInActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const handleRegister = async () => {
    try {
      const { data } = await axios.post(`${backend_url}/api/v1/auth/register`, {
        name,
        email,
        password,
        role,
      });

      if (data?.success) {
        setEmail("");
        setName("");
        setPassword("");
        setRole("");

        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      if ( error.response.data.message) {
        toast.error(error.response.data.message); // Display the error message from the backend
      } else {
        toast.error("Something went wrong. Please try again."); // Fallback message
      }
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${backend_url}/api/v1/auth/login`, {
        email,
        password,
      });

      if (data?.success) {
        setEmail("");
        setName("");
        setPassword("");
        setRole("");
        toast.success(data?.message);
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({
          user: data.user,
          token: data.token,
        });

        navigate("/");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      if ( error.response.data.message) {
        toast.error(error.response.data.message); // Display the error message from the backend
      } else {
        toast.error("Something went wrong. Please try again."); // Fallback message
      }
      console.log(error);
    }
  };

  return (
    // Big Screen

    <div className=" w-full h-screen bg-gradient-to-r  from-[#ffffff] to-[#c9d6ff] flex justify-center items-center">
      <div className="shadow min-w-[50%] m-4 bg-white overflow-hidden relative rounded-3xl hidden md:flex h-[450px]  ">
        {/* login */}
        <div className="w-1/2 h-full flex items-center overflow-hidden">
          <div
            className={`${
              isSignInActive ? "" : " translate-x-full"
            } w-full p-10 flex transform duration-500 ease-in-out  items-center  justify-center flex-col  `}
          >
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
            <div className="flex gap-2 px-4 py-1 cursor-pointer font-semibold rounded-lg flex items-center border-2 border-black mb-4">
              <FcGoogle className="text-3xl" />
              Sign In with google
            </div>
            <span className="mb-4">or use your email and password</span>
            <div className="flex flex-col gap-4 mb-6">
              <div className="relative">
                <MdEmail className="absolute top-2 left-2 text-2xl text-gray-400" />
                <input
                  className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none py-2 placeholder:text-gray-400 pl-10 pr-2 "
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <IoLockClosed className="text-2xl top-2 left-2 absolute text-gray-400" />
                <input
                  className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none  py-2 placeholder:text-gray-400 pl-10 pr-10 "
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-2 text-gray-400 text-2xl cursor-pointer"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </div>
              </div>
            </div>
            <span className="mb-6 hover:text-[#512da8] cursor-pointer">Forget your Password?</span>
            <button
              className="w-[10rem] hover:bg-opacity-90 transfrom duration-300 ease-in-out rounded-lg py-2 bg-[#512da8] font-semibold text-white"
              type="button"
              onClick={handleLogin}
            >
              Sign In
            </button>
          </div>
        </div>
        {/* signUp */}
        <div className="w-1/2 h-full flex items-center overflow-hidden">
          <div
            className={`${
              isSignInActive ? "-translate-x-full" : ""
            } w-full p-4 flex transform duration-500 ease-in-out  items-center  justify-center flex-col  `}
          >
            <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
            <div className="flex gap-2 cursor-pointer px-4 py-1 text-gray font-semibold rounded-lg flex items-center border-2 border-black mb-4">
              <FcGoogle className="text-3xl" />
              Sign Up with google
            </div>
            <span className="mb-4">or use your email for registeration</span>
            <div className="flex flex-col gap-4 mb-5">
              <div className="relative">
                <IoPerson className="top-2 left-2 absolute text-2xl text-gray-400" />
                <input
                  className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none py-2 placeholder:text-gray-400  pl-10 pr-2 "
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div className="relative flex items-center">
                <FaUserCog className="text-2xl top-2 left-2 absolute text-gray-400" />
                <select
                  value={role}
                  defaultValue=""
                  className={`w-[300px] appearance-none ${role ? "" : "text-gray-500 "} bg-gray-200 rounded-[5px] focus:outline-none  py-2  pl-10 pr-10 `}
                  onChange={(e) => handleRole(e)}
                >
                  <option value="" disabled hidden>
                    Role
                  </option>
                  <option className="text-black " value={"recruiter"}>
                    Recruiter
                  </option>
                  <option className="text-black " value={"candidate"}>
                    Candidate
                  </option>
                </select>
                <IoChevronDown className="absolute top-3 right-2 text-gray-400 text-xl cursor-pointer" />
              </div>
              <div className="relative">
                <MdEmail className="absolute top-2 left-2 text-2xl text-gray-400" />
                <input
                  className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none py-2 placeholder:text-gray-400 pl-10 pr-2 "
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div className="relative">
                <IoLockClosed className="text-2xl top-2 left-2 absolute text-gray-400" />
                <input
                  className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none  py-2 placeholder:text-gray-400 pl-10 pr-10 "
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-2 text-gray-400 text-2xl cursor-pointer"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </div>
              </div>
            </div>
            <button
              className="w-[10rem] hover:bg-opacity-90 transfrom duration-300 ease-in-out rounded-lg py-2 bg-[#512da8] font-semibold text-white"
              type="button"
              onClick={handleRegister}
            >
              Sign Up
            </button>
          </div>
        </div>
        {/* mover */}
        <div
          className={`${
            isSignInActive
              ? "translate-x-full rounded-l-[25%] rounded-r-3xl"
              : "rounded-r-[25%] rounded-l-3xl"
          } w-1/2 h-full bg-[#512da8] absolute z-10 transform duration-500 ease-in-out `}
        ></div>
        {/* mover text for signin */}
        <div className="overflow-hidden h-full absolute  z-20  w-full pointer-events-none flex">
          <div
            className={`${
              isSignInActive ? "-translate-x-full  opacity-0" : "translate-x-0 pointer-events-auto opacity-1"
            } w-1/2 flex flex-col gap-5 px-8 text-center transform duration-500 ease-in-out items-center justify-center`}
          >
            <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
            <span className="text-gray-200">
              Sign in to access your personalized content and explore all the features of our platform.
            </span>
            <button
              onClick={() => setIsSignInActive(true)}
              className="w-[10rem] rounded-lg py-2 border-2  font-semibold text-white"
              type="button"
            >
              Sign In
            </button>
          </div>
          {/* mover text for signup */}

          <div
            className={`${
              isSignInActive ? " opacity-1 pointer-events-auto  translate-x-0" : "opacity-0  translate-x-full"
            } w-1/2   flex flex-col gap-5 px-8 text-center transform duration-500 ease-in-out items-center justify-center`}
          >
            <h1 className="text-2xl font-bold text-white">Hello, Friend!</h1>
            <span className="text-gray-200">
              Sign up to create an account and unlock the full potential of our services. We’re excited to
              have you onboard!
            </span>
            <button
              onClick={() => setIsSignInActive(false)}
              className="w-[10rem] rounded-lg py-2 border-2  font-semibold text-white"
              type="button"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Small Screen */}

      <div className="flex md:hidden ">
        <div className="px-5 py-4  w-[100%] bg-white  shadow rounded-2xl flex flex-col justify-center    inside-authentication">
          <div className=" border-2 my-5 w-full   border-[#512da8] rounded-full  buttons-authentication">
            <button
              onClick={() => {
                setIsSignInActive(true);
              }}
              className={`${
                isSignInActive
                  ? "text-white bg-[#512da8] font-semibold  text-xl w-[50%] py-2 rounded-full "
                  : "text-[#512da8] font-semibold  text-xl w-[50%] py-2 rounded-full "
              } `}
              type="button"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignInActive(false);
              }}
              className={`${
                isSignInActive
                  ? "text-[#512da8] font-semibold  text-xl w-[50%] py-2 rounded-full "
                  : "text-white bg-[#512da8] font-semibold  text-xl w-[50%] py-2 rounded-full "
              } `}
              type="button"
            >
              Sign Up
            </button>
          </div>
          <form className="mx-3  my-6">
            {isSignInActive ? (
              <>
                <div>
                  <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                  <div className="flex flex-col gap-4 mb-6">
                    <div className="relative">
                      <MdEmail className="absolute top-2 left-2 text-2xl text-gray-400" />
                      <input
                        className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none py-2 placeholder:text-gray-400 pl-10 pr-2 "
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <IoLockClosed className="text-2xl top-2 left-2 absolute text-gray-400" />
                      <input
                        className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none  py-2 placeholder:text-gray-400 pl-10 pr-10 "
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-2 right-2 text-gray-400 text-2xl cursor-pointer"
                      >
                        {showPassword ? <IoEyeOff /> : <IoEye />}
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>

                  <div className="flex flex-col gap-4 mb-5">
                    <div className="relative">
                      <IoPerson className="top-2 left-2 absolute text-2xl text-gray-400" />
                      <input
                        className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none py-2 placeholder:text-gray-400  pl-10 pr-2 "
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                      />
                    </div>
                    <div className="relative flex items-center">
                      <FaUserCog className="text-2xl top-2 left-2 absolute text-gray-400" />
                      <select
                        value={role}
                        defaultValue=""
                        className={`w-[300px] appearance-none ${role ? "" : "text-gray-500 "} bg-gray-200 rounded-[5px] focus:outline-none  py-2  pl-10 pr-10 `}
                        onChange={(e) => handleRole(e)}
                      >
                        <option value="" disabled hidden>
                          Role
                        </option>
                        <option className="text-black " value={"recruiter"}>
                          Recruiter
                        </option>
                        <option className="text-black " value={"candidate"}>
                          Candidate
                        </option>
                      </select>
                      <IoChevronDown className="absolute top-3 right-2 text-gray-400 text-xl cursor-pointer" />
                    </div>
                    <div className="relative">
                      <MdEmail className="absolute top-2 left-2 text-2xl text-gray-400" />
                      <input
                        className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none py-2 placeholder:text-gray-400 pl-10 pr-2 "
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                    </div>

                    <div className="relative">
                      <IoLockClosed className="text-2xl top-2 left-2 absolute text-gray-400" />
                      <input
                        className="w-[300px] bg-gray-200 rounded-[5px] focus:outline-none  py-2 placeholder:text-gray-400 pl-10 pr-10 "
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-2 right-2 text-gray-400 text-2xl cursor-pointer"
                      >
                        {showPassword ? <IoEyeOff /> : <IoEye />}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-center">
              <button
                className={`${
                  isSignInActive
                    ? "w-[10rem]  hover:bg-opacity-90 transfrom duration-300 ease-in-out rounded-lg py-2 bg-[#512da8] font-semibold text-white"
                    : "hidden"
                }`}
                type="button"
                onClick={handleLogin}
              >
                Sign In
              </button>
              <button
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRegister();
                  }
                }}
                className={`${
                  isSignInActive
                    ? "hidden"
                    : "w-[10rem] hover:bg-opacity-90 transfrom duration-300 ease-in-out rounded-lg py-2 bg-[#512da8] font-semibold text-white"
                }`}
                type="button"
                onClick={handleRegister}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
