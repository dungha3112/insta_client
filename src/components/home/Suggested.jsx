import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../common/UserCard";
import { TfiReload } from "react-icons/tfi";
import { getSuggestions } from "../../redux/actions/suggestedAction";
import LoadICon from "../../assets/images/loading.gif";
import FollowBtn from "../common/FollowBtn";

const Suggested = () => {
  const { auth, suggestions } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.access_token) {
      dispatch(getSuggestions(auth.access_token));
    }
  }, [auth.access_token, dispatch]);

  const handleReloadSuggestions = () => {
    if (suggestions.loading) return;
    dispatch(getSuggestions(auth.access_token));
  };
  return (
    <div className="px-10">
      <UserCard user={auth.user} />
      <div className="flex items-center justify-between py-2">
        <h5 className="font-serif text-[#ccc]">Suggested for you</h5>
        <TfiReload
          className="cursor-pointer"
          onClick={handleReloadSuggestions}
        />
      </div>
      {suggestions.loading && (
        <img src={LoadICon} alt="Loading" className="block mx-auto text-sm" />
      )}
      {suggestions.users.length ? (
        <div className="flex flex-col gap-2">
          {suggestions.users.map((user) => (
            <UserCard key={user._id} user={user}>
              <FollowBtn user={user} />
            </UserCard>
          ))}
        </div>
      ) : (
        <h2>No suggestions</h2>
      )}

      <div className="pt-2">
        <p className="text-center text-sm text-[#ccc]">
          © {new Date().getFullYear()} INSTAGRAM FROM META
        </p>
        <p className="text-center text-sm text-[#ccc]">Created by Dung Ha</p>
      </div>
    </div>
  );
};

export default Suggested;
