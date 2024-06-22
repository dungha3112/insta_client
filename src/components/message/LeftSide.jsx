import React, { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getConversations } from "../../redux/actions/messageAction";
import UserCard from "../common/UserCard";
import SearchUser from "./SearchUser";
import { MESSAGE_TYPES } from "../../redux/reducers/messageReducer";

const LeftSide = () => {
  const { auth, message, online } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { id } = useParams();

  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const [isModalSearch, setIsModalSearch] = useState(false);
  const navigate = useNavigate();

  const handleAddUser = (user) => {
    dispatch({
      type: MESSAGE_TYPES.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });
    dispatch({ type: MESSAGE_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
    setIsModalSearch(false);
    return navigate(`/message/${user._id}`);
  };

  const isActive = (user) => {
    if (id === user._id) return "active";
    return "";
  };

  // get conversations
  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversations({ auth }));
  }, [auth, dispatch, message.firstLoad]);

  // Load more
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }));
    }
  }, [message.resultUsers, page, auth, dispatch]);

  // check user online offline
  useEffect(() => {
    if (message.firstLoad) {
      dispatch({ type: MESSAGE_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
    }
  }, [dispatch, message.firstLoad, online]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-5">
        <h1 className="text-[18px] font-bold">{auth.user.username}</h1>
        <IoSearch
          className="cursor-pointer"
          fontSize={24}
          onClick={() => setIsModalSearch(true)}
        />
      </div>

      <div className="flex items-center justify-between px-2 pb-5">
        <h1 className="text-[16px] font-bold">Messages</h1>
      </div>

      {/* chatlist */}
      <div className="message_chat_list">
        {message.users.length > 0 && (
          <>
            {message.users.map((user) => (
              <div
                key={user._id}
                className={`message_user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} msg={true}>
                  <div>
                    {user.online ? (
                      <LuDot className="text-blue-500" fontSize={30} />
                    ) : (
                      auth.user.following.find(
                        (item) => item._id === user._id
                      ) && <LuDot className="text-gray-500" fontSize={30} />
                    )}
                  </div>
                </UserCard>
              </div>
            ))}
          </>
        )}
      </div>
      <button ref={pageEnd} style={{ opacity: 0 }}>
        Load more
      </button>
      {isModalSearch && <SearchUser setIsModalSearch={setIsModalSearch} />}
    </>
  );
};

export default LeftSide;
