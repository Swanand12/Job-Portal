import Layout from "@/Layout/Layout";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaArrowUpRightFromSquare, FaGraduationCap } from "react-icons/fa6";
import { FaFileDownload, FaDoorOpen, FaDoorClosed, FaLightbulb } from "react-icons/fa";
import { TbFileTypeDocx } from "react-icons/tb";
import { MdLocationOn, MdPictureAsPdf } from "react-icons/md";
import { ImBriefcase } from "react-icons/im";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const JobDetails = () => {
  const { auth } = useAuth();
  const [job, setJob] = useState([]);
  const params = useParams();
  const [selectedEducation, setSelectedEductaion] = useState("Intermediate");
  const [experience, setExperience] = useState("Fresher");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState("");
  const [application, setApplication] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [JobDetailsLoading, setJobDetailsLoading] = useState(false);
  const [fetchJob, setFetchJob] = useState(false);
  const [fetchApplication, setFetchApplication] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [status, setStatus] = useState(["Applied", "Interviewing", "Hiring", "Rejected"]);

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const getJobDetails = async () => {
    try {
      setJobDetailsLoading(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.get(`${backend_url}/api/v1/job/get-single-job/${params.jid}`, config);

      if (data.success) {
        setJob(data.job);
        setJobDetailsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setJobDetailsLoading(false);
    }
  };

  useEffect(() => {
    getJobDetails();
  }, [fetchJob]);

  const handleChange = (e) => {
    setSelectedEductaion(e.target.value);
  };

  const submitApplication = async () => {
    try {
      setApplicationLoading(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const application = new FormData();
      application.append("job_id", job._id);
      application.append("resume", resume);
      application.append("skills", skills);
      application.append("experience", experience);
      application.append("education", selectedEducation);
      application.append("name", auth?.user?.name);

      const { data } = await axios.post(
        `${backend_url}/api/v1/application/post-application`,
        application,
        config,
      );

      if (data.success) {
        setApplication(data.application);
        setApplicationLoading(false);
        setFetchApplication(!fetchApplication);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);

      setApplicationLoading(false);
    }
  };

  const getApplications = async () => {
    try {
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.get(
        `${backend_url}/api/v1/application/get-job-applications/${params.jid}`,
        config,
      );

      if (data.success) {
        setAllApplications(data.applications);
        setStatusUpdateLoading(false);
      }
    } catch (error) {
      console.log(error);
      setStatusUpdateLoading(false);
    }
  };

  useEffect(() => {
    getApplications();
  }, [fetchApplication]);

  const handleStatus = async (id, updatedStatus) => {
    try {
      setStatusUpdateLoading(true);
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.put(
        `${backend_url}/api/v1/application/update-status`,
        { id, updatedStatus },
        config,
      );

      if (data.success) {
        setFetchApplication(!fetchApplication);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleHiringStatus = async (jid, updatedHiringStatus) => {
    try {
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.put(
        `${backend_url}/api/v1/job/update-hiring-status`,
        { jid, updatedHiringStatus },
        config,
      );

      if (data.success) {
        setFetchJob(!fetchJob);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div key={job._id} className="text-white px-4  md:px-[4rem] ">
        <BarLoader className="mt-6" color="#36d7b7" loading={JobDetailsLoading} width="100%" height={5} />
        {!JobDetailsLoading && (
          <>
            <div className="flex lg:flex-row flex-col  lg:items-center mt-5 mb-10 gap-4 justify-between">
              <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.6rem] font-bold ">{job.title}</h1>
              <img
                className="h-[2.5rem] sm:h-[2.8rem] w-[fit-content]"
                src={`${backend_url}/api/v1/job/get-company/${job?.company}`}
                alt="company-image"
              />
            </div>
            {auth.user.role === "recruiter" && job.recruiter_id === auth.user._id && (
              <div className="mb-10 ">
                <Select value={job.isOpen} onValueChange={(value) => handleHiringStatus(job._id, value)}>
                  <SelectTrigger
                    className={`text-black ${job.isOpen ? "bg-[#1fb814]" : "bg-[#ff0000]"}  font-semibold border-none w-full`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={true}>Hiring Status (Open)</SelectItem>
                    <SelectItem value={false}>Hiring Status (Closed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-between ">
              <span className="flex gap-3 items-center ">
                <MdLocationOn />
                {job.location}
              </span>
              <span className="flex gap-3 items-center ">
                <ImBriefcase />
                {allApplications.length} Applicants
              </span>
              <span className="flex gap-3 items-center ">
                {job.isOpen ? (
                  <>
                    <FaDoorOpen />
                    Open
                  </>
                ) : (
                  <>
                    <FaDoorClosed />
                    Closed
                  </>
                )}
              </span>
            </div>
            <div className="flex-col my-10">
              <h1 className="text-3xl mb-10 font-semibold">About the job</h1>
              <p className="">{job.description}</p>
            </div>
            <div className="mb-10 flex flex-col">
              <h1 className="text-3xl mb-10 font-semibold">What we are looking for</h1>
              <p className="">
                <MDEditor.Markdown
                  source={job.requirements}
                  className="bg-black text-white markdown"
                ></MDEditor.Markdown>
              </p>
            </div>
            {auth.user.role === "candidate" ? (
              <div className="flex justify-center mb-10">
                <Drawer>
                  <DrawerTrigger
                    className={` py-2 w-full cursor-pointer rounded-sm ${allApplications.find((a) => a.candidate_id._id === auth.user._id) || !job.isOpen ? "bg-red-800 pointer-events-none" : "bg-blue-600"}`}
                  >
                    {allApplications.find((a) => a.candidate_id._id === auth.user._id) ? "Applied" : "Apply"}
                  </DrawerTrigger>
                  <DrawerContent className="bg-[#020817] border-none">
                    <BarLoader
                      className="mt-6"
                      color="#36d7b7"
                      loading={applicationLoading}
                      width="100%"
                      height={5}
                    />
                    <DrawerHeader className="flex flex-col items-center">
                      <DrawerTitle className="text-white">Apply now</DrawerTitle>
                      <DrawerDescription>Please fill the below form</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="flex flex-col items-center">
                      <input
                        type="number"
                        className="py-2 px-3 w-full rounded-sm"
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Years of Experience"
                      />
                      <input
                        type="text"
                        className="py-2 px-3 w-full rounded-sm"
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="Skills (e.g., JavaScript, React, Node.js)"
                      />
                      {resume && (
                        <div
                          className={`${resume.type === "application/pdf" ? "bg-red-600" : "bg-blue-600"} text-white my-3 mx-[auto]  rounded-lg py-3  px-3 w-[fit-content]  preview`}
                        >
                          <span className="flex rounded-lg gap-3 items-center">
                            {resume.type === "application/pdf" ? (
                              <MdPictureAsPdf className="text-2xl" />
                            ) : (
                              <TbFileTypeDocx className="text-2xl" />
                            )}{" "}
                            <a
                              className="flex items-center"
                              target="_blank"
                              href={URL.createObjectURL(resume)}
                            >
                              {resume.name}
                              <FaArrowUpRightFromSquare className="ml-3 text-xl" />
                            </a>
                          </span>
                        </div>
                      )}
                      <div className="relative mb-12 w-full">
                        <input
                          id="resume"
                          hidden
                          type="file"
                          onChange={(e) => setResume(e.target.files[0])}
                          accept=".pdf, .doc, .docx"
                          className=""
                        />
                        <label
                          htmlFor="resume"
                          className="absolute w-full text-center text-white rounded-sm py-3 rounded-sm top-0 z-10 bg-gray-900 "
                        >
                          Upload Resume
                        </label>
                      </div>
                      <div className="flex flex-col w-full gap-2 my-3">
                        <div className="text-white gap-2 flex items-center">
                          <input
                            onChange={handleChange}
                            type="radio"
                            id="Intermediate"
                            value="Intermediate"
                            checked={selectedEducation === "Intermediate"}
                          />
                          <label htmlFor="Intermediate">Intermediate</label>
                        </div>
                        <div className="text-white gap-2 flex items-center">
                          <input
                            onChange={handleChange}
                            type="radio"
                            id="Graduate"
                            value="Graduate"
                            checked={selectedEducation === "Graduate"}
                          />
                          <label htmlFor="Graduate">Graduate</label>
                        </div>
                        <div className="text-white gap-2 flex items-center">
                          <input
                            onChange={handleChange}
                            type="radio"
                            id="Post Graduate"
                            value="Post Graduate"
                            checked={selectedEducation === "Post Graduate"}
                          />
                          <label htmlFor="Post Graduate">Post Graduate</label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={submitApplication}
                        className="text-white bg-blue-600 py-2 w-full rounded-sm "
                      >
                        Submit
                      </button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            ) : (
              <>
                {job?.recruiter_id?._id === auth.user._id && (
                  <div>
                    <h1 className="text-3xl mb-10 font-semibold">Applications</h1>
                    <BarLoader
                      className="my-6"
                      color="#36d7b7"
                      loading={statusUpdateLoading}
                      width="100%"
                      height={5}
                    />

                    {allApplications.map((a) => (
                      <div key={a._id} className=" mb-2 py-3 px-5 bg-gray-900 rounded-lg">
                        <h1 className="text-3xl mb-5 font-semibold">{a.candidate_id.name}</h1>
                        <div className="flex flex-wrap gap-5  justify-between">
                          <span className="flex gap-3 items-center ">
                            <ImBriefcase /> {a.experience} years experience
                          </span>
                          <span className="flex gap-3 items-center ">
                            <FaLightbulb /> Skills: {a.skills}
                          </span>
                          <span className="flex gap-3 items-center ">
                            <FaGraduationCap /> Education: {a.education}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-8 mb-5">
                          <Select
                            className="text-lg"
                            value={a.status}
                            onValueChange={(value) => handleStatus(a._id, value)}
                          >
                            <SelectTrigger
                              className="    rounded-lg
          px-[1rem] py-[1.3rem] bg-gray-900  text-white placeholder:text-gray-400 w-[10rem]  text-gray-400  border border-gray-400"
                            >
                              <SelectValue className="text-white" placeholder="Company" />
                            </SelectTrigger>
                            <SelectContent
                              className=" bg-gray-900   rounded-lg
            appearance-none text-white  border border-gray-400"
                            >
                              {status.map((c, i) => (
                                <SelectItem key={i} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div>
                            <a
                              className="flex items-center gap-3 bg-white text-gray-900 py-2 px-3 rounded-lg"
                              href={`${backend_url}/api/v1/application/get-resume/${a._id}`}
                            >
                              <FaFileDownload />
                              Resume
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default JobDetails;
