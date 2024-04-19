import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 z-[29] w-[100vw] h-[100vh] bg-black/60 flex justify-center items-center">
      <img src="/lastloader.gif" alt="..." />
    </div>
  );
};

export default Loader;
