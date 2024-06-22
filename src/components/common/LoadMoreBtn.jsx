import React from "react";

const LoadMoreBtn = ({ result, page, loading, handleLoadMore }) => {
  return (
    <>
      {result < 3 * (page - 1)
        ? ""
        : !loading && (
            <button
              onClick={handleLoadMore}
              className=" block mx-auto justify-center bg-green-500 hover:bg-opacity-55 transition text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline text-sm"
            >
              Load More
            </button>
          )}
    </>
  );
};

export default LoadMoreBtn;
