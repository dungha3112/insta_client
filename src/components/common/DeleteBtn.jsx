import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const DeleteBtn = ({ user }) => {
  const { access_token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleDeleteUser = () => {};
  return (
    <IoMdCloseCircle
      title="Remove"
      fontSize={18}
      className="cursor-pointer hover:text-red-500 absolute right-4"
      onClick={handleDeleteUser}
    />
  );
};

export default DeleteBtn;
