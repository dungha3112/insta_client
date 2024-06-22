import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../common/PostCard";
import LoadMoreBtn from "../common/LoadMoreBtn";
import LoadIcon from "../../assets/images/loading.gif";
import { getDataAPI } from "../../utils/fetchData";
import { POST_TYPE } from "../../redux/actions/postAction";

const Posts = () => {
  const { homePosts, auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(
      `posts?limit=${homePosts.page * 9}`,
      auth.access_token
    );
    dispatch({
      type: POST_TYPE.GET_POSTS,
      payload: { ...res.data, page: homePosts.page + 1 },
    });

    setLoad(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center mx-0">
      {homePosts &&
        homePosts.posts.map((post) => <PostCard post={post} key={post._id} />)}

      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}

      <LoadMoreBtn
        result={homePosts.result}
        page={homePosts.page}
        loading={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default Posts;
