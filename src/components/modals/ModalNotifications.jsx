import { IoMdCloseCircle, IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { FaRegHeart } from "react-icons/fa";
import { BsBellSlashFill, BsFillBellFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import moment from "moment";
import { GoDotFill } from "react-icons/go";
import {
  deleteANotify,
  deleteAllNotifies,
  readNotify,
} from "../../redux/actions/notifyAction";
import { useEffect, useState } from "react";
import { NOTIFY_TYPES } from "../../redux/reducers/notifyReducer";
import ModalConfirm from "./ModalConfirm";

const ModalNotifications = () => {
  const { modal, auth, notify } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [notifies, setNotifies] = useState([]);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [checkBellNotifies, setCheckBellNotifies] = useState(
    localStorage.getItem("openBellNotifies")
  );
  const [openBellNotifies, setOpenBellNotifies] = useState(false);

  const handleReadNotify = (msg) => {
    dispatch(readNotify({ msg, auth }));
  };

  const handleDeleteANotify = (msg) => {
    dispatch(deleteANotify({ msg, auth }));
  };

  const handleOpenModalConfirmDeleteNotifies = () => {
    setIsDeleteAll(true);
  };
  const handleDeleteNotifies = () => {
    dispatch(deleteAllNotifies({ token: auth.access_token, setIsDeleteAll }));
  };

  const handleCloseBellNotifies = () => {
    setOpenBellNotifies(false);
    localStorage.removeItem("openBellNotifies");
  };

  const handleOpenBellNotifies = () => {
    setOpenBellNotifies(true);
    localStorage.setItem("openBellNotifies", "open");
  };

  useEffect(() => {
    setCheckBellNotifies(localStorage.getItem("openBellNotifies"));
    if (checkBellNotifies) {
      setOpenBellNotifies(true);
    } else {
      setOpenBellNotifies(false);
    }
  }, [checkBellNotifies]);

  useEffect(() => {
    if (openBellNotifies) {
      dispatch({ type: NOTIFY_TYPES.UPDATE_SOUND, payload: true });
    } else {
      dispatch({ type: NOTIFY_TYPES.UPDATE_SOUND, payload: false });
    }
  }, [dispatch, openBellNotifies]);

  useEffect(() => {
    const removeDuplicateObjects = (array) => {
      const idMap = new Map();
      array.forEach((item) => {
        if (!idMap.has(item._id)) {
          idMap.set(item._id, item);
        }
      });
      return Array.from(idMap.values());
    };

    const uniqueArray = removeDuplicateObjects(notify.data);
    setNotifies(uniqueArray);
  }, [notify.data]);

  return (
    <div
      className={`fixed top-0 left-[var(--sidebar-width-mobile)] w-[calc(100vw-90px)] xs:w-width-modal transition duration-300 ease-in-out shadow-2xl bg-white h-full rounded-tr-xl rounded-br-xl z-[9999] ${
        modal.noti ? "opacity-100 " : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <div>
              {
                // notify.sound
                openBellNotifies ? (
                  <BsFillBellFill
                    fontSize={18}
                    className="cursor-pointer"
                    onClick={handleCloseBellNotifies}
                  />
                ) : (
                  <BsBellSlashFill
                    fontSize={18}
                    className="cursor-pointer"
                    onClick={handleOpenBellNotifies}
                  />
                )
              }
            </div>
          </div>
          <IoMdCloseCircle
            fontSize={28}
            onClick={() => {
              dispatch({
                type: GLOBALTYPES.MODAL,
                payload: { noti: false },
              });
            }}
            className="cursor-pointer hover:text-red-500"
          />
        </div>
      </div>
      <hr className="pt-2" />

      {notify.data.length === 0 && (
        <div className="w-full p-6 flex flex-col transition">
          <div className="border p-3 rounded-full mx-auto">
            <FaRegHeart fontSize={40} />
          </div>
          <p className="text-sm text-center pt-4">Activity On Your Posts</p>
          <p className="text-sm text-center pt-4">
            When someone likes or comments on one of your posts, you'll see it
            here.
          </p>
        </div>
      )}

      {notifies.length > 0 && (
        <div className="p-4 flex items-center justify-between">
          <span className="font-bold">Recent</span>
          <span
            className="cursor-pointer text-sm select-none"
            onClick={handleOpenModalConfirmDeleteNotifies}
          >
            Delete all
          </span>
        </div>
      )}

      <div className="h-full overflow-auto">
        {notifies.map((msg, index) => {
          return (
            <div
              key={msg._id}
              className="flex w-full justify-between px-3 items-center transition duration-300 ease-in-out hover:bg-[#f1f1f1]"
            >
              <Link
                to={`${msg.url}`}
                className="w-full flex gap-2 items-center py-2"
                onClick={() => handleReadNotify(msg)}
              >
                <Avatar url={msg.user.avatar} classname="big-avatar" />
                <div className="flex-1">
                  <div>
                    <span className="font-bold">{msg.user.username}: </span>
                    <span>{msg.text}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Avatar url={msg.image} classname="middle-avatar" />
                      {msg.content && (
                        <small>{msg.content.slice(0, 20)}...</small>
                      )}
                    </div>
                    <small>{moment(msg.createdAt).fromNow()}</small>
                  </div>
                </div>
              </Link>
              <div>
                <IoMdClose
                  className="cursor-pointer hover:text-red-500"
                  fontSize={20}
                  onClick={() => handleDeleteANotify(msg)}
                />
                <GoDotFill
                  className={`${
                    msg.isUserReaded.includes(auth.user._id)
                      ? ""
                      : "text-blue-500"
                  } `}
                  fontSize={18}
                />
              </div>
            </div>
          );
        })}
      </div>

      {isDeleteAll && (
        <ModalConfirm
          title="Are you sure want to delete notifies ?"
          des=""
          textYes="Yes"
          textNo="Cancel"
          onClickYes={handleDeleteNotifies}
          onClickNo={() => setIsDeleteAll(false)}
        />
      )}
    </div>
  );
};

export default ModalNotifications;
