import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import Layout from "@/Layout/Layout";
import axios from "axios";
import { FaFileDownload, FaGraduationCap, FaLightbulb } from "react-icons/fa";
import { ImBriefcase } from "react-icons/im";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const getApplications = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const id = auth.user._id;

      const { data } = await axios.post(
        `${backend_url}/api/v1/application/get-candidate-applications`,
        { id },
        config,
      );

      if (data.success) {
        setApplications(data.applications);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);
  return (
    <>
      <Layout>
        <div className=" px-4 md:px-[4rem] items-center flex flex-col text-white">
          <h1 className="text-[3rem] md:text-[4rem] font-bold leading-none bg-gradient-to-br from-[#6b7280] via-[#e5e7eb] to-white bg-clip-text text-transparent text-white my-5 md:mb-10 ">
            My Applications
          </h1>
          {applications.length > 0 ? (
            applications.map((a) => (
              <div key={a?._id} className=" my-2 py-5 w-full px-5 bg-gray-900 rounded-lg">
                <div className="flex mb-10 flex-wrap items-center justify-between gap-6">
                  <h1 className="text-2xl sm:text-3xl  font-semibold">{a?.job_id?.title}</h1>
                  <img
                    className="h-[2rem] sm:h-[2.8rem] w-[fit-content]"
                    src={`${backend_url}/api/v1/job/get-company/${a?.job_id?.company}`}
                    alt="company-image"
                  />
                </div>
                <div className="flex flex-wrap gap-5  justify-between">
                  <span className="flex gap-3 items-center ">
                    <ImBriefcase /> {a?.experience} years experience
                  </span>
                  <span className="flex gap-3 items-center ">
                    <FaLightbulb /> Skills: {a?.skills}
                  </span>
                  <span className="flex gap-3 items-center ">
                    <FaGraduationCap /> Education: {a?.education}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-8 ">
                  <span>Status: {a?.status}</span>
                  <div>
                    <a
                      className="flex items-center gap-3 bg-white text-gray-900 py-2 px-3 rounded-lg"
                      href={`${backend_url}/api/v1/application/get-resume/${a?._id}`}
                    >
                      <FaFileDownload />
                      Resume
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-3 items-center text-white">
              {applications.length === 0 && (
                <>
                  <h1 className="text-2xl text-center font-semibold pt-8">No Job Applications Yet</h1>
                  <p>
                    You haven’t applied to any jobs. Start applying to your desired opportunities and take the
                    next step in your career!
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default MyApplications;