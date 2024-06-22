import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdAddCircle, IoMdMore } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getUserLikeComment,
  likeComment,
  unLikeComment,
  updateComment,
} from "../../../redux/actions/commentAction";
import Avatar from "../../common/Avatar";
import LikeButton from "../../common/LikeButton";
import CommentMenu from "./CommentMenu";
import { LuMinusCircle } from "react-icons/lu";
import InputComment from "../../common/InputComment";

const CommentCard = ({ children, comment, post, commentId }) => {
  const [content, setContent] = useState("");
  const [readMore, setReadMore] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [loadUserLike, setLoadUserLike] = useState(false);

  const [isLike, setIsLike] = useState(false);
  const [openMoreMenu, setOpenMoreMenu] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [onReply, setOnReply] = useState(false);

  const dispatch = useDispatch();
  const { auth, socket } = useSelector((state) => state);

  useEffect(() => {
    setContent(comment.content);
    setIsLike(false);
    setOnReply(false);
    if (comment.likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    }
  }, [auth.user._id, comment.content, comment.likes]);

  const handleLike = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    await dispatch(likeComment({ comment, post, auth, socket }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    await dispatch(unLikeComment({ comment, post, auth, socket }));
    setLoadLike(false);
  };

  const handleUpdateComment = async () => {
    if (comment.content !== content) {
      await dispatch(updateComment({ comment, post, content, auth }));
      setOnEdit(false);
    } else {
      setOnEdit(false);
    }
  };

  const handleGetUserLikeComment = async () => {
    if (loadUserLike) return;
    setLoadUserLike(true);
    await dispatch(getUserLikeComment({ comment, auth }));
    setLoadUserLike(false);
  };

  const handleReply = async () => {
    if (onReply) return setOnReply(false);

    setOnReply({ ...comment, commentId });
  };

  const styleCard = {
    opacity: comment._id ? 1 : 0.5,
    pointerEvents: comment._id ? "inherit" : "none",
  };

  return (
    <div className="flex flex-col gap-2 mt-2" style={styleCard}>
      <Link
        to={`/profile/${comment.user._id}`}
        className="flex items-center gap-1"
      >
        <Avatar url={comment.user.avatar} classname="medium-avatar" />
        <h6>{comment.user.username}</h6>
      </Link>

      <div className="bg-[#eee] rounded-md rounded-tl-none px-2 py-1">
        <div>
          {onEdit ? (
            <textarea
              placeholder="Write somethings..."
              className="border-none outline-none bg-[#eee] w-full"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div>
              {/* {comment.tag && comment.tag._id && ( */}
              {comment.tag && comment.tag._id !== comment.user._id && (
                <Link
                  to={`/profile/${comment.tag._id}`}
                  className="text-blue-500"
                >
                  @{comment.tag.username}{" "}
                </Link>
              )}
              <span>
                {content.length < 100
                  ? content
                  : readMore
                  ? content + " "
                  : content.slice(0, 100) + "..."}
              </span>
              {content.length > 100 && (
                <span onClick={() => setReadMore(!readMore)}>
                  {readMore ? (
                    <LuMinusCircle
                      className="cursor-pointer !inline"
                      fontSize={20}
                      title="hide"
                    />
                  ) : (
                    <IoMdAddCircle
                      className="cursor-pointer !inline"
                      fontSize={20}
                      title="show more"
                    />
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-2">
          <div className="flex justify-between items-center gap-2">
            <small>{moment(comment.createdAt).fromNow()}</small>
            <small
              className="cursor-pointer font-bold p-1"
              onClick={handleGetUserLikeComment}
            >
              {comment.likes.length} Likes
            </small>
            {onEdit ? (
              <>
                <small
                  className="cursor-pointer font-bold p-1"
                  onClick={handleUpdateComment}
                >
                  Update
                </small>
                <small
                  className="cursor-pointer font-bold"
                  onClick={() => {
                    setOnEdit(false);
                    setContent(comment.content);
                  }}
                >
                  Cancel
                </small>
              </>
            ) : (
              <small className="cursor-pointer font-bold" onClick={handleReply}>
                {onReply ? "cancel" : "reply"}
              </small>
            )}
          </div>

          <div className="flex items-center gap-1">
            <LikeButton
              isLike={isLike}
              fontSize={15}
              handleLike={handleLike}
              handleUnLike={handleUnLike}
            />
            <IoMdMore
              fontSize={15}
              className="cursor-pointer"
              onClick={() => setOpenMoreMenu(true)}
            />
          </div>
        </div>
      </div>

      {onReply && (
        <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
          <Link to={`/profile/${onReply.user._id}`} className="text-blue-300">
            @{onReply.user.username}:
          </Link>
        </InputComment>
      )}

      {children}

      {openMoreMenu && (
        <CommentMenu
          post={post}
          comment={comment}
          setOpenMoreMenu={setOpenMoreMenu}
          setOnEdit={setOnEdit}
        />
      )}
    </div>
  );
};

export default CommentCard;
