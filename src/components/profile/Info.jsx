import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { FaLink } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "../common/Avatar";
import FollowBtn from "../common/FollowBtn";
import ModalFollowers from "../modals/ModalFollowers";
import ModalFollowing from "../modals/ModalFollowing";

const Info = ({ id, auth, profile, dispatch }) => {
  const [userData, setUserData] = useState([]);
  const { modal } = useSelector((state) => state);

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newUser = profile.users.filter((user) => user._id === id);
      setUserData(newUser);
    }
  }, [auth.user, id, profile.users]);

  return (
    <div className="w-full justify-center xl:justify-start flex items-center px-1 xl:px-10 py-8">
      {userData.map((user) => (
        <div
          key={user._id}
          className="flex items-center w-[100vw-230px] xl:w-full gap-2 xl:gap-20 px-2 xl:px-10"
        >
          <Avatar url={String(user.avatar)} classname="supper-avatar" />
          <div className="flex flex-col gap-3">
            <div
              className={`flex items-center gap-2  ${
                Number(user.username.length) >= 12 ? "flex-col" : ""
              }`}
            >
              <span className={`text-3xl`}>{user.username}</span>
              {id === auth.user?._id ? (
                <Link
                  to="/setting"
                  className="outline-none px-4 py-1 bg-[#F0F0F0] font-semibold text-black rounded-lg text-sm"
                >
                  Edit Profile
                </Link>
              ) : (
                <FollowBtn user={user} />
              )}
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="font-bold">2</span>
                <span> posts</span>
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  dispatch({
                    type: GLOBALTYPES.MODAL,
                    payload: { follow: true },
                  })
                }
              >
                <span className="font-bold">{user.followers.length}</span>
                <span> followers</span>
              </div>

              <div
                className="cursor-pointer"
                onClick={() =>
                  dispatch({
                    type: GLOBALTYPES.MODAL,
                    payload: { following: true },
                  })
                }
              >
                <span className="font-bold">{user.following.length}</span>
                <span> following</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span>{user.fullname}</span>
              <span>{user.story}</span>
            </div>
            <div>
              <span>{user.bio}</span>
              {user.website && (
                <Link to={user.website} target="_blank">
                  <FaLink />
                </Link>
              )}
            </div>
          </div>
          {modal.follow && <ModalFollowers users={user.followers} />}
          {modal.following && <ModalFollowing users={user.following} />}
        </div>
      ))}
    </div>
  );
};

export default Info;
