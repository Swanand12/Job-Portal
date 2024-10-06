import React from "react";
import Header from "./Header.jsx";

const Layout = ({ children }) => {
  return (
    <div className="layout w-full ">
      <Header />
      <div className="main ">{children}</div>
    </div>
  );
};

export default Layout;
