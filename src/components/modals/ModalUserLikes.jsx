import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import FollowBtn from "../common/FollowBtn";
import UserCard from "../common/UserCard";

const ModalUserLikes = () => {
  const { auth, modal } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="fixed top-0 left-0 bg-[#0008] w-full h-[100vh] z-[9999]">
      <div className="w-[350px] h-[400px] border-1 border-[#222] rounded-sm bg-white px-5 py-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-auto">
        <div className="flex items-center justify-between px-0 py-2">
          <h5 className="">Likes</h5>
          <IoIosCloseCircle
            onClick={() =>
              dispatch({
                type: GLOBALTYPES.MODAL,
                payload: { likes: false, userLikes: [] },
              })
            }
            fontSize={20}
            className="cursor-pointer hover:text-red-400"
          />
        </div>
        <hr className="py-2" />
        <div className="flex flex-col gap-2">
          {modal.userLikes.map((user) => (
            <UserCard user={user} key={user._id}>
              {auth.user?._id !== user._id && <FollowBtn user={user} />}
            </UserCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalUserLikes;
