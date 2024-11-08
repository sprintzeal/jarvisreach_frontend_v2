import React from "react";
import SideNav from "./mainLayout/SideNav";
import Topbar from "./mainLayout/Topbar";

const Config = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          width: "100%",
        }}
      >
        <SideNav />
        <Topbar />
      </div>
    </>
  );
};

export default Config;
