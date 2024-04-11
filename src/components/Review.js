import React from "react";

const Review = ({name, school, comment}) => {
  return (
    <div className="bg-[#161616] p-4 mt-4 md:mt-0 md:w-[47vw]">
      <div className="flex justify-between">
        <h2 className="text-[#4CE5B1]">{name}</h2>
        <h2 className="text-[#4CE5B1]">{school}</h2>
      </div>
      <p className="w-full max-h-[25vh] overflow-auto text-white">
        {comment}
      </p>
    </div>
  );
};

export default Review;
