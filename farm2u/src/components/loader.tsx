import Image from "next/image";
import loaderimage from "@/resources/form2u_logo.jpg";
import { useState } from "react";
import React from "react";
type Visibility = "visible" | "hidden" | "collapse";

const Loader = (props: any) => {
  const [loader, setLoader] = useState<Visibility>("visible");

  setTimeout(() => {
    setLoader("hidden");
  }, props.time);

  return (
    <div className="loader_bg" style={{ visibility: loader }}>
      <div className="loader_block">
        <div className="loader"></div>
      </div>
      <div className="loader_block">
        <div className="loader1">
          <Image className="logo_preloader" src={loaderimage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
