import Layout from "../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { State } from "country-state-city";
import MDEditor from "@uiw/react-md-editor";
import toast from "react-hot-toast";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const PostJob = () => {
  const { auth } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [location, setLocation] = useState("");
  const [requirements, setRequirements] = useState(`
   # Job Requirements
   Eg: 
   - Strong proficiency in JavaScript, including DOM manipulation.  
   - Familiar with RESTful APIs and modern front-end build pipelines.  
   - Excellent problem-solving and communication skills.`);
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companies, setCompanies] = useState([]);

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const addCompany = async () => {
    try {
      if (!companyName) {
        return toast.error("Please add company name");
      }
      if (!companyLogo) {
        return toast.error("Please add company logo");
      }

      const companyDetails = new FormData();
      companyDetails.append("companyName", companyName);
      companyDetails.append("companyLogo", companyLogo);

      const { data } = await axios.post(`${backend_url}/api/v1/company/add-company`, companyDetails);

      if (data.success) {
        toast.success(data.message);
        setCompanies([...companies, data.newCompany]);
        setCompanyName("");
        setCompanyLogo("");
        getCompanies();
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const postJob = async () => {
    try {
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const job = { title, description, location, company: selectedCompany, requirements };

      const { data } = await axios.post(`${backend_url}/api/v1/job/post-job`, job, config);

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setDescription("");
        setRequirements("");
        setSelectedCompany("");
        setLocation("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Layout>
        <div className="flex justify-center mb-6 flex-col items-center">
          <h1 className="text-[3rem] md:text-[4rem] font-bold leading-none  bg-gradient-to-br from-[#6b7280] via-[#e5e7eb] to-white bg-clip-text text-transparent text-white my-5 md:mb-10">
            Post Job{" "}
          </h1>
          <div className="flex flex-col w-full px-4 md:px-10 justify-center ">
            <input
              value={title}
              type="text"
              placeholder="Job Title"
              onChange={(e) => setTitle(e.target.value)}
              className="py-2 mb-4 rounded-lg px-[1rem] text-white bg-gray-900 placeholder:text-white focus:outline-none w-full  border border-[#1e293b]"
            />
            <Textarea
              value={description}
              placeholder="Job Description"
              onChange={(e) => setDescription(e.target.value)}
              className="py-2 text-[16px] focus:outline-none h-[7rem]   mb-4  rounded-lg px-[1rem] text-white w-full bg-gray-900 placeholder:text-white  border border-[#1e293b]"
            />

            <div className="flex md:flex-row flex-col gap-4 justify-between w-full">
              <Select className="" value={location} onValueChange={(value) => setLocation(value)}>
                <SelectTrigger
                  className="rounded-l px-[1rem] py-[1.3rem] bg-gray-900 placeholder:text-white w-full md:w-1/3  appearance-none text-white   border border-[#1e293b]"
                >
                  <SelectValue className="text-white" placeholder="Location" />
                </SelectTrigger>
                <SelectContent
                  className="rounded-lg appearance-none text-white bg-gray-900  border border-[#1e293b]"
                >
                  {State.getStatesOfCountry("IN").map((s, i) => (
                    <SelectItem key={i} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-full sm:gap-0 gap-4 md:w-2/3 flex sm:flex-row flex-col ">
                <Select
                  className=""
                  value={selectedCompany}
                  onValueChange={(value) => setSelectedCompany(value)}
                >
                  <SelectTrigger
                    className="rounded-lg px-[1rem] py-[1.3rem] bg-gray-900 placeholder:text-white  sm:w-1/2  text-white  border border-[#1e293b]"
                  >
                    <SelectValue className="text-white" placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-lg appearance-none text-white bg-gray-900  border border-[#1e293b]"
                  >
                    {companies.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Drawer>
                  <DrawerTrigger className="py-2.5 px-3 sm:w-1/2 sm:ml-4 rounded-lg  bg-blue-600 hover:bg-blue-700 duration-300 text-white font-semibold">
                    Add Company
                  </DrawerTrigger>
                  <DrawerContent className="bg-[#020817] border-none">
                    <DrawerHeader>
                      <DrawerTitle className="text-2xl text-white text-center w-full mb-4 font-semibold">
                        Add Company
                      </DrawerTitle>
                      <div className="flex flex-col items-center">
                        {companyLogo && (
                          <img
                            className="h-[100px] w-[fit-content] rounded-lg my-5"
                            src={URL.createObjectURL(companyLogo)}
                            alt="preview-companyLogo"
                          />
                        )}
                        <div className="flex gap-4 w-full">
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="px-3  rounded-sm    py-2 w-1/2 "
                          />
                          <div className="relative w-1/2">
                            <label
                              htmlFor="Company-Logo"
                              className="absolute rounded-sm text-center w-full text-white inset-0 bg-gray-900 font-semibold py-2  "
                            >
                              {companyLogo ? companyLogo.name : "Company Logo"}
                            </label>
                            <input
                              hidden
                              onChange={(e) => setCompanyLogo(e.target.files[0])}
                              type="file"
                              accept="image/*"
                              id="Company-Logo"
                              className="px-3 text-gray-500 rounded-sm     py-2  border"
                            />
                          </div>
                        </div>
                      </div>
                    </DrawerHeader>
                    <DrawerFooter>
                      <button
                        type="button"
                        onClick={addCompany}
                        className="text-white bg-blue-600 py-2 w-full rounded-sm text-lg font-semibold hover:bg-opacity-80"
                      >
                        Submit
                      </button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            <div className="markdown mt-4 ">
              <MDEditor className="custom-editor" value={requirements} onChange={setRequirements} />
            </div>
            <button
              className=" py-2.5 rounded-lg mt-4 font-semibold text-white bg-[#1fb814] hover:bg-opacity-80 duration-300"
              onClick={postJob}
              type="button"
            >
              Post
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PostJob;