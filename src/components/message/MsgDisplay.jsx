import moment from "moment";
import React from "react";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdCallEnd, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage } from "../../redux/actions/messageAction";
import Avatar from "../common/Avatar";
import Times from "../common/Times";

const MsgDisplay = ({ user, msg, data }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleDeleteMessage = () => {
    if (!data) return;
    if (window.confirm("Do you want to delete?")) {
      dispatch(deleteMessage({ msg, data, auth, socket }));
    }
  };

  const style = {
    fontSize: "2.5rem",
    color: msg.call && msg.call.times === 0 ? "crimson" : "green",
  };

  return (
    <>
      <div className="chat_title">
        <Avatar url={user.avatar} classname="medium-avatar" />
        <span className="block">{user.username}</span>
      </div>

      <div className="you_content">
        {auth.user._id === user._id && (
          <MdDelete
            className="icon_delete hover:text-red-500 cursor-pointer"
            fontSize={18}
            onClick={handleDeleteMessage}
          />
        )}
        <div>
          {msg.text && <div className="chat_text">{msg.text}</div>}
          {msg.media.map((item, index) => (
            <div key={index}>
              {item.url.match(/video/i) ? (
                <video
                  controls
                  src={item.url}
                  alt="video"
                  className={`object-cover h-64 mb-3`}
                />
              ) : (
                <img
                  src={item.url}
                  alt="images"
                  className={`object-cover h-64 mb-3`}
                />
              )}
            </div>
          ))}
        </div>
        {msg.call && (
          <button
            className="flex items-center p-3"
            style={{ background: "#eee", borderRadius: "10px" }}
          >
            {msg.call.times === 0 ? (
              msg.call.video ? (
                <FaVideoSlash style={style} />
              ) : (
                <MdCallEnd style={style} />
              )
            ) : msg.call.video ? (
              <FaVideo style={style} />
            ) : (
              <IoCall style={style} />
            )}

            <div className="text-left">
              <h6>{msg.call.video ? "Video Call" : "Audio Call"} </h6>
              <small>
                {msg.call.times > 0 ? (
                  <Times total={msg.call.times} />
                ) : (
                  new Date(msg.createdAt).toLocaleTimeString()
                )}
              </small>
            </div>
          </button>
        )}
      </div>

      <div className="chat_time">{moment(msg.createdAt).fromNow()}</div>
    </>
  );
};

export default MsgDisplay;
