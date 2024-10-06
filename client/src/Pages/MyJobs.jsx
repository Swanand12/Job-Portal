import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import Layout from "@/Layout/Layout";
import axios from "axios";
import { MdLocationOn } from "react-icons/md";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const getJobs = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const id = auth.user._id;

      const { data } = await axios.post(`${backend_url}/api/v1/job/get-recruiter-jobs`, { id }, config);

      if (data.success) {
        setJobs(data.jobs);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);
  return (
    <Layout>
      <div className="px-4  text-white flex items-center flex-col">
        <h1 className="text-[3rem] md:text-[4rem] font-bold leading-none bg-gradient-to-br from-[#6b7280] via-[#e5e7eb] to-white bg-clip-text text-transparent text-white my-5 md:mb-10 ">
          My Jobs
        </h1>
        <div className="flex flex-wrap justify-center mx-6 my-6 gap-5">
          {jobs.length > 0 ? (
            jobs.map((j) => (
              <div
                key={j._id}
                className="card shadow-lg shadow-gray-900  rounded-sm shadow-xl w-[350px] text-white p-4"
              >
                <h1 className="text-xl mb-6 font-semibold">{j.title}</h1>
                <div className="flex pb-5  border-b border-gray-500 justify-between items-center">
                  <img
                    className="h-[2rem]"
                    src={`${backend_url}/api/v1/job/get-company/${j.company}`}
                    alt="image-logo"
                  />
                  <span className="flex gap-3 items-center">
                    <MdLocationOn />
                    {j.location}
                  </span>
                </div>
                <hr className="" />
                <p className="my-3 text-sm">{j.description.substring(0, 130)}...</p>

                <button
                  type="button"
                  className="bg-gray-900 w-full rounded-sm py-2 text-center"
                  onClick={() => {
                    navigate(`/recruiter/job-details/${j._id}`);
                  }}
                >
                  More Details
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-3 text-white">
              <h1 className="text-2xl text-center font-semibold">No job found</h1>
              <p className="text-center">
                Sorry, the job you are looking for does not exist or has been removed
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyJobs;
