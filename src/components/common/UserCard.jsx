import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "./Avatar";
import { MdCallEnd, MdPermMedia } from "react-icons/md";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoCall } from "react-icons/io5";

const UserCard = ({ children, user, handleClose, msg }) => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => state);

  const handleCloseAll = () => {
    if (handleClose) handleClose();
    if (modal.follow) {
      dispatch({
        type: GLOBALTYPES.MODAL,
        payload: { follow: false },
      });
    }
    if (modal.following) {
      dispatch({
        type: GLOBALTYPES.MODAL,
        payload: { following: false },
      });
    }
  };

  const showMsg = (user) => {
    return (
      <>
        <div>
          {user.text.length > 3 ? user.text.slice(0, 3) + "..." : user.text}
        </div>
        {user.media && user.media.length > 0 ? (
          <div className="flex items-center gap-1">
            {user.media.length} <MdPermMedia />
          </div>
        ) : (
          <></>
        )}

        {user.call && (
          <span className="material-icons">
            {user.call.times === 0 ? (
              user.call.video ? (
                <FaVideoSlash />
              ) : (
                <MdCallEnd />
              )
            ) : user.call.video ? (
              <FaVideo />
            ) : (
              <IoCall />
            )}
          </span>
        )}
      </>
    );
  };

  return (
    <div className="flex items-center w-full justify-between">
      <div>
        <Link
          to={`/profile/${user._id}`}
          className="flex items-center gap-2 w-full"
          onClick={handleCloseAll}
        >
          <div className="flex items-center gap-2 cursor-pointer w-full">
            <Avatar url={user.avatar} classname="big-avatar" />
            <div className="flex flex-col">
              <span>{user.username}</span>
              <span>{msg ? showMsg(user) : user.fullname}</span>
            </div>
          </div>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default UserCard;
