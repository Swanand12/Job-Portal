import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImHome } from "react-icons/im";
import { IoBriefcase, IoHeartSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { MdLogout, MdLogin } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    navigate("/");
    toast.success("Log Out successfully");
  };
  return (
    <>
      <div className="header w-full py-4 px-6 font-semibold  md:px-[4rem]  flex items-center justify-between ">
        <Link to={"/"}>
          <img className="h-[5rem] sm:h-[6rem] text-white" src="/assets/logo-light.png" alt="logo" />
        </Link>
        <div className="hidden  custom:flex  gap-7">
          <NavLink className="text-white relative  text-lg" to={"/"}>
            Home
          </NavLink>
          {auth && auth?.user?.role === "candidate" && (
            <>
              <NavLink className="text-white relative  text-lg" to={"/candidate/jobs"}>
                Jobs
              </NavLink>
              <NavLink className="text-white relative  text-lg" to={"/candidate/saved-jobs"}>
                Saved Jobs
              </NavLink>
              <NavLink className="text-white relative  text-lg" to={"/candidate/my-applications"}>
                My Applications
              </NavLink>
            </>
          )}
          {auth && auth?.user?.role === "recruiter" && (
            <>
              <NavLink className="text-white relative  text-lg" to={"/recruiter/jobs"}>
                Jobs
              </NavLink>
              <NavLink className="text-white relative  text-lg" to={"/recruiter/post-job"}>
                Post Job
              </NavLink>
              <NavLink className="text-white relative  text-lg" to={"/recruiter/my-jobs"}>
                My Jobs
              </NavLink>
            </>
          )}
          {!auth.token ? (
            <NavLink className="text-white relative  text-lg" to={"/auth"}>
              Log In
            </NavLink>
          ) : (
            <button type="button" onClick={handleLogOut} className="text-white relative  text-lg">
              Log Out
            </button>
          )}
        </div>
        <div className="custom:hidden flex">
          <DropdownMenu className="text-white ">
            <DropdownMenuTrigger className=" text-white text-2xl">
              <GiHamburgerMenu />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-6 mt-2 pl-2 pr-4 flex flex-col flex-start  md:mr-14 ">
              <DropdownMenuItem>
                <NavLink className=" relative flex items-center gap-3  text-[16px] px-1 py-0.5  " to={"/"}>
                  <ImHome /> Home
                </NavLink>
              </DropdownMenuItem>
              {auth && auth?.user?.role === "candidate" && (
                <>
                  <DropdownMenuItem>
                    <NavLink
                      className=" relative flex items-center gap-3  text-[16px] px-1 py-0.5  "
                      to={"/candidate/jobs"}
                    >
                      <IoBriefcase /> Jobs
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <NavLink
                      className=" relative flex items-center gap-3  text-[16px] px-1 py-0.5  "
                      to={"/candidate/saved-jobs"}
                    >
                      <IoHeartSharp /> Saved Jobs
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink
                      className=" relative flex items-center gap-3  text-[16px] px-1 py-0.5  "
                      to={"/candidate/my-applications"}
                    >
                      <FaFileLines /> My Applications
                    </NavLink>
                  </DropdownMenuItem>
                </>
              )}
              {auth && auth?.user?.role === "recruiter" && (
                <>
                  <DropdownMenuItem>
                    <NavLink
                      className=" relative flex items-center gap-3  text-[16px] px-1 py-0.5  "
                      to={"/recruiter/jobs"}
                    >
                      <IoBriefcase /> Jobs
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink
                      className=" relative flex items-center gap-3  text-[16px] px-1 py-0.5  "
                      to={"/recruiter/post-job"}
                    >
                      <IoMdAdd /> Post Job
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink
                      className=" relative flex items-center gap-3  text-[16px] px-1 py-0.5  "
                      to={"/recruiter/my-jobs"}
                    >
                      <LuClipboardList /> My Jobs
                    </NavLink>
                  </DropdownMenuItem>
                </>
              )}
              {!auth.token ? (
                <DropdownMenuItem>
                  <NavLink
                    className=" relative flex items-center gap-3  text-[16px] px-1 py-0.5  "
                    to={"/auth"}
                  >
                    <MdLogin /> Log In
                  </NavLink>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  {" "}
                  <button
                    type="button"
                    onClick={handleLogOut}
                    className=" relative flex items-center gap-3  text-[16px] px-1 py-0.5  "
                  >
                    <MdLogout /> Log Out
                  </button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default Header;
