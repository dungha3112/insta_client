import React, { useEffect, useState } from "react";
import LoadIcon from "../../assets/images/loading.gif";
import { getDataAPI } from "../../utils/fetchData";
import LoadMoreBtn from "../common/LoadMoreBtn";
import PostThumb from "../common/PostThumb";

const Saved = ({ auth, dispatch }) => {
  const [savePosts, setSavePosts] = useState([]);

  const [result, setResult] = useState(9);

  const [page, setPage] = useState(2);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);

    getDataAPI(`post/save_posts`, auth.access_token)
      .then((res) => {
        setSavePosts(res.data.posts);
        setResult(res.data.result);
      })
      .catch((err) => {})
      .finally(() => {
        setLoad(false);
      });

    return () => setSavePosts([]);
  }, [auth.access_token]);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(
      `post/save_posts?limit=${page * 9}`,
      auth.access_token
    );
    setSavePosts(res.data.posts);
    setResult(res.data.result);
    setPage(page + 1);
    setLoad(false);
  };

  return (
    <div>
      <PostThumb posts={savePosts} result={result} />

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

export default Saved;
