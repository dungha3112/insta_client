import React, { useEffect, useState } from "react";
import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfileUsers } from "../../redux/actions/profileAction";
import LoadingIcon from "../../assets/images/loading.gif";
import Saved from "../../components/profile/Saved";

const Profile = () => {
  const { profile, auth } = useSelector((state) => state);

  const { id } = useParams();
  const dispatch = useDispatch();

  const [saveTab, setSaveTab] = useState(false);

  useEffect(() => {
    if (profile.ids.every((item) => item !== id)) {
      dispatch(getProfileUsers({ id, auth }));
    }
  }, [auth, dispatch, id, profile.ids]);

  return (
    <div className="w-full min-h-[100vh]">
      {profile.loading && (
        <img src={LoadingIcon} alt="Loading" className="block mx-auto py-8" />
      )}
      <Info id={id} auth={auth} profile={profile} dispatch={dispatch} />
      {auth.user._id === id && (
        <div className="w-full flex gap-2 items-center border-t border-[#eee] border-b justify-center">
          <button
            className={`${
              !saveTab && "border-t-2 border-b=2 opacity-80"
            } opacity-50 border-none outline-none font-bold bg-white py-1 px-3 uppercase`}
            onClick={() => setSaveTab(false)}
          >
            Posts
          </button>
          <button
            className={`${
              saveTab && "border-t-2 border-b=2 border-[#000] opacity-80"
            } opacity-50 border-none outline-none font-bold bg-white py-1 px-3 uppercase`}
            onClick={() => setSaveTab(true)}
          >
            Saved
          </button>
        </div>
      )}

      {profile.loading ? (
        <img src={LoadingIcon} alt="Loading" className="block mx-auto py-8" />
      ) : (
        <div className="w-full p-10">
          {saveTab ? (
            <Saved auth={auth} dispatch={dispatch} />
          ) : (
            <Posts id={id} auth={auth} profile={profile} dispatch={dispatch} />
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
