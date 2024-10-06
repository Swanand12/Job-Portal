import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import Layout from "@/Layout/Layout";
import axios from "axios";
import { BarLoader } from "react-spinners";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdLocationOn } from "react-icons/md";

const SavedJobs = () => {
  const [savedJobs, setSavedjobs] = useState([]);
  const { auth } = useAuth();
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(false);
  const [fetchSavedJobs, setFetchSavedJobs] = useState(false);
  const [disableSavedButton, setDisabledSavedButton] = useState(false);

  const navigate = useNavigate();

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const getSavedjobs = async () => {
    try {
      setLoadingSavedJobs(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.get(`${backend_url}/api/v1/saved-jobs/get-saved-jobs`, config);

      if (data.success) {
        setSavedjobs(data.savedJobs);
        setLoadingSavedJobs(false);
      }
    } catch (error) {
      setLoadingSavedJobs(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getSavedjobs();
  }, []);



  const unSaveJob = async (job) => {
    try {
      setLoadingSavedJobs(true);
      setDisabledSavedButton(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.delete(`${backend_url}/api/v1/saved-jobs/unsave-job/${job?._id}`, config);

      if (data.success) {
        setSavedjobs((prev) => prev.filter((j) => j?.job_id?._id !== job?._id));
        setLoadingSavedJobs(false);
        setDisabledSavedButton(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <h1 className="text-[3rem] md:text-[4rem] font-bold leading-none  bg-gradient-to-br from-[#6b7280] via-[#e5e7eb] to-white bg-clip-text text-transparent text-white my-5 md:mb-10">
          Saved Jobs{" "}
        </h1>
        <BarLoader className="mt-6" color="#36d7b7" loading={loadingSavedJobs} width="100%" height={5} />

        <div className="flex flex-wrap justify-center mx-6 my-6 gap-5">
          {savedJobs.length > 0 ? (
            savedJobs.map((j) => (
              <div
                key={j?.job_id?._id}
                className="card shadow-lg shadow-gray-900  rounded-sm shadow-xl w-[350px] text-white p-4"
              >
                <h1 className="text-xl mb-6 font-semibold">{j?.job_id?.title}</h1>
                <div className="flex pb-5  border-b border-gray-500 justify-between items-center">
                  <img
                    className="h-[2rem]"
                    src={`${backend_url}/api/v1/job/get-company/${j?.job_id?.company}`}
                    alt="image-logo"
                  />
                  <span className="flex gap-3 items-center">
                    <MdLocationOn />
                    {j?.job_id?.location}
                  </span>
                </div>
                <hr className="" />
                <p className="my-3 text-sm">{j?.job_id?.description.substring(0, 130)}...</p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="bg-gray-900 w-full rounded-sm py-2 text-center"
                    onClick={() => {
                      navigate(`/candidate/job-details/${j?.job_id?._id}`);
                    }}
                  >
                    More Details
                  </button>
                  <button
                    type="button"
                    disabled={disableSavedButton}
                    onClick={() => unSaveJob(j?.job_id)}
                    className="cursor-pointer"
                  >
                    <IoHeart className="text-[#ff0000] text-2xl" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-3 items-center text-white">
              {savedJobs.length === 0 && (
                <>
                  <h1 className="text-2xl text-center font-semibold pt-8">No Saved Jobs Yet</h1>
                  <p>Sorry, the job you are looking for does not exist or has been removed</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SavedJobs;