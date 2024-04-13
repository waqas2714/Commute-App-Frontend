import React, { useState } from "react";
import axios from 'axios';
import { backendUrl } from "../utils/backendUrl";
import {toast} from 'react-toastify';
import { toastOptions } from "..";

const ReviewUser = ({ image, driverName, from, to, reviewId, setReviews }) => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [comment, setComment] = useState("");

    const addReview = async (e)=>{
        e.stopPropagation();
        e.preventDefault();
        if (comment === "") {
          return
        }
        try {
            const {data} = await axios.post(`${backendUrl}/api/reviews/addReview/${reviewId}`, {comment});
            
            if (!data.success) {
                return toast.error(data.error, toastOptions);
            }

            toast.success("Review Added", toastOptions);
            setIsReviewModalOpen(false);
            setReviews((prev)=>prev.filter((review) => review.reviewId !== reviewId))
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <>
      {/* Review Modal and backdrop */}
      {isReviewModalOpen && (
        <div className="fixed top-[10vh] left-0 flex justify-center items-center w-screen h-[90vh] bg-[rgba(0,0,0,0.7)] z-10" onClick={()=>setIsReviewModalOpen(false)}>
          <form onSubmit={addReview} className="w-[90vw] max-w-[610px] h-[35vh] p-4 bg-[#4CE5B1] text-black flex flex-col justify-around items-center" onClick={(e)=>e.stopPropagation()}>
            <h1 className="text-xl font-extrabold">Add Your Review</h1>
            <div className="flex flex-col gap-y-2 w-full">
              <h2 className="text-lg font-bold">Comment</h2>
              <input
                type="text"
                className="p-2 text-black rounded-full border-none outline-none"
                placeholder="Your Comment"
                onChange={(e)=>setComment(e.target.value)}
                value={comment}
              />
            </div>
            <button type="submit" className="bg-black text-white rounded-full p-2 mt-1">
              Submit!
            </button>
          </form>
        </div>
      )}
      {/* sm:w-[47vw] md:w-[31vw] lg:w-[23vw] */}
      <div className="flex bg-[#161616] w-full sm:w-[350px] text-white p-2 mt-2 hover:bg-[#4CE5B1] group transition-all ease-in-out duration-150" onClick={()=>{navigator.onLine ? setIsReviewModalOpen(true) : toast.error("Please add your review when you are online.", toastOptions)}}>
        <img
          src={image}
          alt="driver's photo"
          className="w-[30%] rounded-full"
        />
        <div className="p-2 text-lg">
          <div className="flex align-baseline gap-x-1">
            <h4 className="text-[#4CE5B1] font-semibold group-hover:text-black group-hover:font-bold">
              Driver:
            </h4>
            <p className="group-hover:text-black">{driverName}</p>
          </div>
          <div className="flex align-baseline gap-x-1">
            <h4 className="text-[#4CE5B1] font-semibold group-hover:text-black group-hover:font-bold">
              From:
            </h4>
            <p className="group-hover:text-black">{from}</p>
          </div>
          <div className="flex align-baseline gap-x-1">
            <h4 className="text-[#4CE5B1] font-semibold group-hover:text-black group-hover:font-bold">
              To:
            </h4>
            <p className="group-hover:text-black">{to}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewUser;
