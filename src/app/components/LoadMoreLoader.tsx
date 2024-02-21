"use client";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { RotatingLines } from "react-loader-spinner";

interface loadMoreProps {
  increaseIndex: () => void;
}

export default function LoadMoreLoader({ increaseIndex }: loadMoreProps) {
  const { ref, inView, entry } = useInView();

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        increaseIndex();
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} className="flex justify-center items-center">
      <RotatingLines
        visible={true}
        // height="30"
        width="30"
        strokeColor="grey"
        strokeWidth="5"
        animationDuration=".75"
        ariaLabel="rotating-lines-loading"
        // wrapperStyle={{}}
        // wrapperClass=""
      />
    </div>
  );
}
