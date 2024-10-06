import React, { useRef, useState } from "react";
import Layout from "../Layout/Layout";
import faq from "../data/faqs.json";
import companies from "../data/companies.json";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Home = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Layout>
        <div className=" px-4  md:px-[4rem]">
          <div className="font-sans h-full text-white  ">
            <div className=" mt-10 w-full  items-center  flex flex-col justify-center ">
              <span className="text-[1.5rem] xs:text-[2rem] sm:text-[3rem] md:text-[3.5rem]  lg:text-[5.5rem]  items-center flex flex-col bg-gradient-to-br from-[#6b7280] via-[#e5e7eb] to-white bg-clip-text text-transparent mb-[3rem]  tracking-tight leading-tight font-[800] ">
                Find Your Dream Job
                <span className="flex">
                  and get
                  <img
                    className="ml-[0.3rem] sm:ml-[1rem] h-[2.5rem] xs:h-[3rem] sm:h-[5rem] md:h-[6rem] lg:h-[7.5rem] text-white"
                    src="./assets/logo-light.png"
                    alt="logo"
                  />
                </span>
              </span>
              <p className="text-[12px] text-center sm:text-lg mb-[4rem]">
                Explore thousands of job listing or find the perfect candidate
              </p>
              <div className="flex">
                {auth?.user?.role === "candidate" ? (
                  <button
                    type="button"
                    onClick={() => navigate("/candidate/jobs")}
                    className="py-2 text-sm sm:py-3 lg:py-5 mr-5 w-[6rem] xs:w-[8rem] md:w-[10rem] lg:w-[12rem] bg-blue-600 rounded-lg hover:bg-blue-700  duration-300 ease-in-out font-bold xs:text-xl flex items-center justify-center"
                  >
                    Find Jobs
                  </button>
                ) : auth?.user?.role === "recruiter" ? (
                  <button
                    type="button"
                    onClick={() => navigate("/recruiter/post-job")}
                    className="py-2 text-sm sm:py-3 lg:py-5 mr-5 w-[6rem] xs:w-[8rem] md:w-[10rem] lg:w-[12rem] bg-red-600 rounded-lg hover:bg-red-700 duration-300 ease-in-out font-bold xs:text-xl flex items-center justify-center"
                  >
                    Post Jobs
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/auth");
                        toast.success("Login to access features");
                      }}
                      className="py-2 text-sm sm:py-3 lg:py-5 mr-5 w-[6rem] xs:w-[8rem] md:w-[10rem] lg:w-[12rem] bg-blue-600 rounded-lg hover:bg-blue-700 duration-300 ease-in-out font-bold xs:text-xl flex items-center justify-center"
                    >
                      Find Jobs
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/auth");
                        toast.success("Login to access features");
                      }}
                      className="py-2 text-sm sm:py-3 lg:py-5 mr-5 w-[6rem] xs:w-[8rem] md:w-[10rem] lg:w-[12rem] bg-red-600 rounded-lg hover:bg-red-700 duration-300 ease-in-out font-bold xs:text-xl flex items-center justify-center"
                    >
                      Post Jobs
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-[3rem] sm:mt-[6rem] carousel text-white">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 2000,
                }),
              ]}
            >
              <CarouselContent className="flex gap-3 sm:gap-6">
                {companies.map((c) => (
                  <CarouselItem
                    key={c.id}
                    className=" flex justify-center items-center basis-1/2 xs:basis-1/3  lg:basis-1/5"
                  >
                    <img
                      className="h-[3rem] md:h-[4rem] flex px-2  object-contain"
                      src={c.path}
                      alt="carousel"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="banner flex justify-center py-[4rem] sm:py-[7rem]">
            <img className="w-full" src="./assets/banner.jpeg" alt="banner" />
          </div>
          <div className="cards text-white flex flex-col md:flex-row justify-between w-full">
            <div className="w-full md:w-[49%] mb-8 rounded-lg bg-[#020817] border border-[#1e293b] px-8 py-6 ">
              <h2 className="mb-4 text-2xl font-semibold">For Job Seekers</h2>
              <p>Search and apply for jobs, track applications, and more.</p>
            </div>
            <div className="w-full md:w-[49%] mb-8 rounded-lg bg-[#020817] border border-[#1e293b]  px-8 py-6">
              <h2 className="mb-4 text-2xl font-semibold">For Employers</h2>
              <p>Post jobs, manage applications, and find the best candidates.</p>
            </div>
          </div>
          <div className="accordion text-white my-8">
            <h1 className="text-3xl sm:text-4xl mb-10 font-semibold">Frequently Asked Questions</h1>
            <Accordion type="single" collapsible>
              {faq.map((item, i) => (
                <AccordionItem key={i} value={i + 1}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
