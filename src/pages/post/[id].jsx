import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../../redux/actions/postAction";
import LoadIcon from "../../assets/images/loading.gif";
import PostCard from "../../components/common/PostCard";

const PostDetails = () => {
  const [post, setPost] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detailPost, auth } = useSelector((state) => state);

  useEffect(() => {
    if (id) {
      dispatch(getPost({ detailPost, id, auth }));
      if (detailPost.length > 0) {
        const newArr = detailPost.filter((post) => post._id === id);
        setPost(newArr);
      }
    }
  }, [auth, detailPost, dispatch, id]);

  return (
    <div className="mx-auto m-2 w-[500px]">
      {post.length === 0 && (
        <img src={LoadIcon} alt="LoadIcon" className="block mx-auto my-4" />
      )}
      {post && post.map((item) => <PostCard post={item} key={item._id} />)}
    </div>
  );
};

export default PostDetails;
