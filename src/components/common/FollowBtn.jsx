import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { follow, unfollow } from "../../redux/actions/profileAction";

const FollowBtn = ({ user }) => {
  const dispatch = useDispatch();
  const { auth, profile, socket } = useSelector((state) => state);
  const [follower, setFollower] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (
      auth.user &&
      auth.user.following.find((item) => item._id === user._id)
    ) {
      setFollower(true);
    }
    return () => setFollower(false);
  }, [auth, user._id]);

  const handleFollow = async () => {
    if (load) return;
    setFollower(true);
    setLoad(true);
    await dispatch(follow({ users: profile.users, user, auth, socket }));

    setLoad(false);
  };

  const handleUnFollow = async () => {
    if (load) return;
    setFollower(false);
    setLoad(true);
    await dispatch(unfollow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };

  return follower ? (
    <button
      className="outline-none w-[120px] px-5 py-1 bg-[#e26849] text-white rounded-lg text-sm"
      onClick={handleUnFollow}
    >
      UnFollow
    </button>
  ) : (
    <button
      className="outline-none w-[120px] px-5 py-1 bg-[#1DA1F2] text-white rounded-lg text-sm"
      onClick={handleFollow}
    >
      Follow
    </button>
  );
};

export default FollowBtn;
