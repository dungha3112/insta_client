import React from "react";
import { useSelector } from "react-redux";
import Posts from "../components/home/Posts";
import Suggested from "../components/home/Suggested";
import LoadIcon from "../assets/images/loading.gif";

const HomePage = () => {
  const { homePosts } = useSelector((state) => state);

  if (!homePosts) return;
  return (
    <div className="flex flex-col xl:flex-row w-[calc(100vw-90px)] xl:w-full left-0 xl:left-[var(--sidebar-width-mobile)] py-10">
      <div className="w-full xl:w-[60%]">
        {homePosts.loading ? (
          <img src={LoadIcon} alt="Loading.." className="block mx-auto" />
        ) : homePosts.result === 0 || homePosts.posts.length === 0 ? (
          <h2 className="text-center text-xl font-bold text-red-600">
            No Post
          </h2>
        ) : (
          <div className="mx-auto w-[450px]">
            <Posts />
          </div>
        )}
      </div>
      <div className="w-full xl:w-[40%]">
        <div className="mx-auto xl:mx-0 w-[450px] xl:w-full">
          <Suggested />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
