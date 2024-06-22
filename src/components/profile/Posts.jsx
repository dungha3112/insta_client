import React, { useEffect, useState } from "react";
import PostThumb from "../common/PostThumb";
import LoadIcon from "../../assets/images/loading.gif";
import LoadMoreBtn from "../common/LoadMoreBtn";
import { getDataAPI } from "../../utils/fetchData";
import { PROFILE_TYPES } from "../../redux/reducers/profileReducer";

const Posts = ({ id, auth, profile, dispatch }) => {
  const [posts, setPosts] = useState([]);

  const [result, setResult] = useState(9);

  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    setLoad(true);
    const res1 = await getDataAPI(
      `post/user_posts/${id}?limit=${page * 9}`,
      auth.access_token
    );
    const newData = { ...res1.data, page: page + 1, _id: id };
    dispatch({ type: PROFILE_TYPES.UPDATE_POST, payload: newData });
    setLoad(false);
  };

  useEffect(() => {
    profile.posts.forEach((data) => {
      if (data._id === id) {
        setPosts(data.posts);
        setResult(data.results);
        setPage(data.page);
      }
    });
  }, [profile.posts, id]);

  return (
    <div>
      <PostThumb posts={posts} result={result} />

      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}

      <LoadMoreBtn
        result={result}
        page={page}
        loading={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default Posts;
