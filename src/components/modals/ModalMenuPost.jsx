import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { Link, useNavigate } from "react-router-dom";
import { deletePost } from "../../redux/actions/postAction";
import ModalConfirm from "./ModalConfirm";

const ModalMenuPost = () => {
  const { auth, modal, socket } = useSelector((state) => state);
  const [onDelete, setOnDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditPost = () => {
    dispatch({
      type: GLOBALTYPES.MODAL,
      payload: { onEdit: true, morenenu_post: false, create: true },
    });
  };

  const handleOpenModalConfirmDeletePost = () => {
    setOnDelete(true);
  };

  const handleDeletePost = async () => {
    dispatch(deletePost({ post: modal.post, auth, socket }));
    return navigate("/");
  };

  const handleCancel = () => {
    dispatch({
      type: GLOBALTYPES.MODAL,
      payload: { morenenu_post: false, post: {} },
    });
  };

  return (
    <div className="fixed z-[99999999] inset-0 flex items-center justify-center bg-gray-900 bg-opacity-10">
      <div className="bg-white rounded-lg w-[400px]">
        <div className="flex flex-col py-2 gap-3">
          {modal.post.user._id === auth.user._id && (
            <>
              <span
                className="cursor-pointer w-full flex border-b pb-2 justify-center"
                onClick={handleEditPost}
              >
                Edit Post
              </span>
              <span
                className="cursor-pointer w-full flex border-b pb-2 justify-center"
                onClick={handleOpenModalConfirmDeletePost}
              >
                Delete Post
              </span>
            </>
          )}

          <Link
            to={`/post/${modal.post._id}`}
            onClick={handleCancel}
            className="cursor-pointer w-full border-b pb-2 flex justify-center"
          >
            Go to post
          </Link>
          <span
            className="cursor-pointer w-full flex justify-center"
            onClick={handleCancel}
          >
            Cancel
          </span>
        </div>
      </div>
      {onDelete && (
        <ModalConfirm
          title="Are you sure want to delete this post ?"
          des=""
          textYes="Yes"
          textNo="Cancel"
          onClickYes={handleDeletePost}
          onClickNo={() => setOnDelete(false)}
        />
      )}
    </div>
  );
};

export default ModalMenuPost;
