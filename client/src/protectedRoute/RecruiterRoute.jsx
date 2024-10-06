import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { HashLoader } from "react-spinners";

const RecruiterRoute = () => {
  const { auth } = useAuth();
  const [ok, setOk] = useState(false);

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${backend_url}/api/v1/auth/recruiter-auth`, {
          headers: {
            Authorization: auth?.token,
          },
        });

        if (data.success) {
          setOk(data.ok);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (auth?.token) checkAuth();
  }, [auth?.token]);
  return ok ? (
    <Outlet />
  ) : (
    <div className="flex h-[100vh] justify-center items-center">
      <HashLoader color="#36d7b7" loading={true} width="100%" height={5} />
    </div>
  );
};

export default RecruiterRoute;
