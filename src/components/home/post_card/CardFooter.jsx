import React, { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa6";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getUserLike,
  likePost,
  savePost,
  unLikePost,
  unSavePost,
} from "../../../redux/actions/postAction";
import LikeButton from "../../common/LikeButton";
import ModalUserLikes from "../../modals/ModalUserLikes.jsx";

const CardFooter = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openModalLike, setOpenModalLike] = useState(false);

  const { auth, modal, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleLike = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    await dispatch(unLikePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleOpenUserLike = async () => {
    if (openModalLike) return;
    setOpenModalLike(true);
    await dispatch(getUserLike({ id: post._id, auth }));
    setOpenModalLike(false);
  };

  useEffect(() => {
    if (post.likes.find((item) => item === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [auth.user._id, post.likes]);

  useEffect(() => {
    if (auth.user.saved.find((id) => id === post._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user.saved, post._id]);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton
            isLike={isLike}
            fontSize={22}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
          <Link to={`/post/${post._id}`}>
            <FaRegComment className="cursor-pointer" fontSize={22} />
          </Link>
        </div>
        <div>
          {saved ? (
            <FaBookmark
              className="cursor-pointer text-blue-500"
              fontSize={22}
              onClick={() => dispatch(unSavePost({ post, auth }))}
            />
          ) : (
            <FaRegBookmark
              className="cursor-pointer"
              fontSize={22}
              onClick={() => dispatch(savePost({ post, auth }))}
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <h6
          className="text-sm font-semibold cursor-pointer"
          onClick={handleOpenUserLike}
        >
          {post.likes.length} Likes
        </h6>
        <h6 className="text-sm font-semibold cursor-pointer">
          {post.comments.length} Comments
        </h6>
      </div>
      {modal.likes && <ModalUserLikes />}
    </div>
  );
};

export default CardFooter;
