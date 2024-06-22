import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadIcon from "../assets/images/loading.gif";
import LoadMoreBtn from "../components/common/LoadMoreBtn";
import PostThumb from "../components/common/PostThumb";
import { getExplorePosts } from "../redux/actions/exploreAction";
import { EXPLORE_TYPES } from "../redux/reducers/exploreReducer";
import { getDataAPI } from "../utils/fetchData";

const Explore = () => {
  const { auth, explore } = useSelector((state) => state);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  const handleLoadMore = async () => {
    if (load) return;
    setLoad(true);
    const res = await getDataAPI(
      `post/explore_posts?num=${explore.page * 3}`,
      auth.access_token
    );
    await dispatch({ type: EXPLORE_TYPES.UPDATE_POST, payload: res.data });
    setLoad(false);
  };

  useEffect(() => {
    if (auth.access_token) {
      dispatch(getExplorePosts(auth.access_token));
    }
  }, [auth.access_token, dispatch]);

  return (
    <div className="p-10">
      <div className="flex flex-col xl:flex-row w-[calc(100vw-90px)] xl:w-full left-0 xl:left-[var(--sidebar-width-mobile)]">
        {explore.loading ? (
          <img src={LoadIcon} alt="loading" className="block mx-auto" />
        ) : (
          <PostThumb posts={explore.posts} result={explore.result} />
        )}
      </div>

      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}

      {!explore.loading && (
        <LoadMoreBtn
          result={explore.result}
          page={explore.page}
          loading={explore.loading}
          handleLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
};

export default Explore;
