import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeButton = ({ isLike, handleLike, handleUnLike, fontSize }) => {
  return isLike ? (
    <FaHeart
      className="cursor-pointer text-red-600"
      fontSize={fontSize}
      onClick={handleUnLike}
    />
  ) : (
    <FaRegHeart
      className="cursor-pointer"
      fontSize={fontSize}
      onClick={handleLike}
    />
  );
};

export default LikeButton;
