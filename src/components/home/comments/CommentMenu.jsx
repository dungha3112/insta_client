import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../../../redux/actions/commentAction";

const CommentMenu = ({ post, comment, setOpenMoreMenu, setOnEdit }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleOpenEdit = () => {
    setOnEdit(true);
    setOpenMoreMenu(false);
  };

  const handleRemoveComment = async () => {
    dispatch(deleteComment({ post, auth, comment, socket }));
  };

  const MenuItem = () => {
    return (
      <>
        <span
          className="cursor-pointer w-full flex border-b pb-2 justify-center"
          onClick={handleOpenEdit}
        >
          Edit
        </span>
        <span
          className="cursor-pointer w-full flex border-b pb-2 justify-center"
          onClick={handleRemoveComment}
        >
          Remove
        </span>
      </>
    );
  };
  return (
    <div className="fixed z-[99999999] inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30">
      <div className="bg-white rounded-lg w-[400px]">
        <div className="flex flex-col py-2 gap-3">
          {post.user._id === auth.user._id ? (
            comment.user._id === auth.user._id ? (
              MenuItem()
            ) : (
              <span
                className="cursor-pointer w-full flex border-b pb-2 justify-center"
                onClick={handleRemoveComment}
              >
                Remove
              </span>
            )
          ) : (
            comment.user._id === auth.user._id && MenuItem()
          )}
          <span
            className="cursor-pointer w-full flex justify-center"
            onClick={() => setOpenMoreMenu(false)}
          >
            Cancel
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommentMenu;
