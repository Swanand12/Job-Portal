import Layout from "@/Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";
import { MdLocationOn } from "react-icons/md";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const JobPage = () => {
  const { auth } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [filteredJobLoading, setFilteredJobLoading] = useState(false);
  const [savedJobs, setSavedjobs] = useState([]);
  const [disableSavedButton, setDisabledSavedButton] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const navigate = useNavigate();

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const getCompanies = async () => {
    try {
      const { data } = await axios.get(`${backend_url}/api/v1/company/get-all-companies`);

      if (data.success) {
        setCompanies(data.companies);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const getJobs = async () => {
    try {
      setJobLoading(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.get(`${backend_url}/api/v1/job/get-all-jobs`, config);

      if (data.success) {
        setJobs(data.jobs);
        setJobLoading(false);
      }
    } catch (error) {
      console.log(error);
      setJobLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const loadMoreJobs = async () => {
    try {
      setLoadMore(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.get(`${backend_url}/api/v1/job/load-more-jobs/${page}`, config);

      if (data.success) {
        setJobs([...jobs, ...data.jobs]);
        setPage(page + 1);
        setLoadMore(false);
      }
    } catch (error) {
      console.log(error);
      setLoadMore(false);
    }
  };

  const getTotalJobs = async () => {
    try {
      const { data } = await axios.get(`${backend_url}/api/v1/job/total-jobs`);

      if (data.success) {
        setTotal(data.total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      setFilteredJobLoading(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };
      const { data } = await axios.post(
        `${backend_url}/api/v1/job/get-jobs`,
        { searchQuery, location, company },
        config,
      );

      if (data.success) {
        setJobs(data.filteredJobs);
        setFilteredJobLoading(false);
      }
    } catch (error) {
      console.log(error);
      setFilteredJobLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, location, company]);

  const handleReset = () => {
    setSearchQuery("");
    setLocation("");
    setCompany("");
  };

  const getSavedjobs = async () => {
    try {
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.get(`${backend_url}/api/v1/saved-jobs/get-saved-jobs`, config);

      if (data.success) {
        setSavedjobs(data.savedJobs.map((j) => j.job_id._id));
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getTotalJobs();
    getSavedjobs();
  }, []);

  const saveJob = async (jobId) => {
    const loadingToastId = toast.loading("Saving job...");
    try {
      setDisabledSavedButton(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.post(`${backend_url}/api/v1/saved-jobs/save-job`, { jobId }, config);

      if (data.success) {
        toast.success(data.message, { id: loadingToastId });
        setSavedjobs((prev) => [...prev, jobId]);
        setDisabledSavedButton(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unSaveJob = async (jobId) => {
    const loadingToastId = toast.loading("Removing saved job...");
    try {
      setDisabledSavedButton(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.delete(`${backend_url}/api/v1/saved-jobs/unsave-job/${jobId}`, config);

      if (data.success) {
        toast.success(data.message, { id: loadingToastId });
        setSavedjobs((prev) => prev.filter((j) => j !== jobId));
        setDisabledSavedButton(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="flex justify-center mb-6 flex-col items-center">
        <h1 className="text-[3rem] md:text-[4rem] font-bold leading-none text-white my-5 md:mb-10 ">Jobs </h1>
        <BarLoader className="mt-6" color="#36d7b7" loading={jobLoading} width="100%" height={5} />

        {!jobLoading && (
          <>
            <div className="w-full flex flex-col px-4 items-center">
              <div className="flex gap-3 mb-3 w-full sm:w-3/4 md:w-2/3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 px-3 bg-gray-900 border border-gray-400 text-white focus:outline-none rounded-lg w-full"
                  placeholder="Search job here..."
                />
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-1 rounded-lg font-semibold text-white text-center w-[8rem] bg-red-600 hover:bg-red-700 duration-300"
                >
                  Reset
                </button>
              </div>
              <div className="flex gap-3 mb-6 w-full sm:w-3/4 md:w-2/3">
                <Select className="" value={location} onValueChange={(value) => setLocation(value)}>
                  <SelectTrigger
                    className="rounded-lg px-[1rem] py-[1.3rem] bg-gray-900 placeholder:text-gray-400 w-1/2 text-white appearance-none text-gray-400   border border-gray-400"
                  >
                    <SelectValue className="text-white" placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-gray-900 rounded-lg appearance-none text-white border border-gray-400"
                  >
                    {State.getStatesOfCountry("IN").map((s, i) => (
                      <SelectItem key={i} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select className="" value={company} onValueChange={(value) => setCompany(value)}>
                  <SelectTrigger
                    className="rounded-lg px-[1rem] py-[1.3rem] bg-gray-900  text-white placeholder:text-gray-400 w-1/2  text-gray-400  border border-gray-400"
                  >
                    <SelectValue className="text-white" placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent
                    className=" bg-gray-900  rounded-lg appearance-none text-white  border border-gray-400"
                  >
                    {companies.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <BarLoader
              className="my-6 "
              color="#36d7b7"
              loading={filteredJobLoading}
              width="100%"
              height={5}
            />
            <div className="flex flex-col items-center">
              <div className="flex flex-wrap justify-center mx-4 md:mx-8 my-6 gap-5">
                {jobs.length > 0 ? (
                  jobs.map((j) => (
                    <>
                      <div
                        key={j._id}
                        className="card shadow-lg shadow-gray-900 my-6  rounded-sm shadow-xl w-[350px] text-white p-4"
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
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            className="bg-gray-900 w-full rounded-sm py-2 text-center"
                            onClick={() => {
                              navigate(`/${auth?.user?.role}/job-details/${j._id}`);
                            }}
                          >
                            More Details
                          </button>
                          {auth.user.role === "candidate" && (
                            <button
                              disabled={disableSavedButton}
                              type="button"
                              onClick={() => (savedJobs.includes(j._id) ? unSaveJob(j._id) : saveJob(j._id))}
                              className="cursor-pointer"
                            >
                              {savedJobs.includes(j._id) ? (
                                <IoHeart className="text-[#ff0000] text-2xl" />
                              ) : (
                                <IoHeartOutline className="text-[#ff0000] text-2xl" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="flex flex-col gap-3 text-white">
                    <h1 className="text-2xl text-center font-semibold">No job found</h1>
                    <p>Sorry, the job you are looking for does not exist or has been removed</p>
                  </div>
                )}
              </div>
              <div>
                {loadMore && (
                  <div className="flex flex-wrap justify-center mx-4 md:mx-8 my-6 gap-5">
                    {Array(6)
                      .fill()
                      .map((_, i) => (
                        <div key={i} className=" my-6   w-[350px] p-4">
                          <Skeleton className="bg-gray-600 h-[1.5rem] w-[70%]" />
                          <div className="flex mt-5 mb-5  justify-between items-center">
                            <Skeleton className="bg-gray-600 h-[3rem] w-[11rem]" />
                            <Skeleton className="bg-gray-600 flex w-[6rem] h-[1.3rem] items-center" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Skeleton className="bg-gray-600 h-4 w-full" />
                            <Skeleton className="bg-gray-600 h-4 w-full" />
                            <Skeleton className="bg-gray-600 h-4 w-full" />
                          </div>
                          <div className="flex items-center mt-3 gap-4">
                            <Skeleton className="bg-gray-600 w-[90%] h-[2.5rem]" />
                            <Skeleton className={"bg-gray-600 w-[2rem] h-[2rem]"} />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {jobs && jobs.length < total && !company && !searchQuery && !location && (
                <button
                  type="button"
                  onClick={loadMoreJobs}
                  className="bg-blue-600  w-[10rem] text-white duration-300 hover:bg-blue-700  shadow-xl font-semibold  rounded-lg py-2 text-center"
                >
                  Load More
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default JobPage;
