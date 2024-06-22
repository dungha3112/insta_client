import React, { useEffect, useRef, useState } from "react";
import { IoIosSend, IoMdCloseCircle, IoMdImages } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadIcon from "../../assets/images/loading.gif";
import {
  addMessage,
  deleteConversation,
  getMessages,
  loadMoreMessage,
} from "../../redux/actions/messageAction";
import { imageUpload } from "../../utils/imageUpload";
import { imageShow, videoShow } from "../../utils/mediaShow";
import Icons from "../common/Icons";
import UserCard from "../common/UserCard";
import MsgDisplay from "./MsgDisplay";
import { IoCall, IoVideocam } from "react-icons/io5";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const RightSide = () => {
  const { auth, message, socket, peer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const refDisplay = useRef();
  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [isLoadMore, setIsLoadMore] = useState(0);

  const [user, setUser] = useState([]);
  const [text, setText] = useState("");
  const [openIcons, setOpenIcons] = useState(false);
  const [media, setMedia] = useState([]);

  const [loadMedia, setLoadMedia] = useState(false);

  const changeIcons = async (e) => {
    const sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);

    setText(text ? text + emoji : emoji);
  };

  const deleteImages = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let newMedia = [];
    files.forEach((file) => {
      if (!file) return alert("File does not exist.");
      if (file.type.match(/video/i)) {
        return newMedia.push({
          video: URL.createObjectURL(file),
          file: file,
        });
      } else {
        return newMedia.push({
          image: URL.createObjectURL(file),
          file: file,
        });
      }
    });
    setMedia([...media, ...newMedia]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;

    setMedia([]);
    setText("");
    setOpenIcons(false);

    setLoadMedia(true);
    let newArr = [];
    if (media.length > 0) newArr = await imageUpload(media);

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
      createdAt: new Date().toISOString(),
    };
    setLoadMedia(false);
    await dispatch(addMessage({ msg, auth, socket }));

    if (id) {
      if (refDisplay?.current) {
        refDisplay?.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  };

  const handleDeleteConversation = async () => {
    if (window.confirm("Do you want to delete?")) {
      await dispatch(deleteConversation({ id, auth }));
      return navigate("/message/");
    }
  };

  useEffect(() => {
    const newData = message.data.find((item) => item._id === id);
    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [message.data, id]);

  useEffect(() => {
    if (id && message.users.length > 0) {
      setTimeout(() => {
        refDisplay?.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 1000);
      const newUser = message.users.find((user) => user._id === id);
      if (newUser) setUser(newUser);
    }
  }, [message.users, id]);

  useEffect(() => {
    const getMessagesData = async () => {
      if (message.data.every((item) => item._id !== id)) {
        await dispatch(getMessages({ auth, id }));
        setTimeout(() => {
          refDisplay?.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 1000);
      }
    };
    getMessagesData();
  }, [auth, dispatch, id, message.data]);

  // Load more
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadMore((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(pageEnd.current);
  }, [setIsLoadMore]);

  useEffect(() => {
    if (isLoadMore > 1) {
      if (result >= page * 9) {
        dispatch(loadMoreMessage({ auth, id, page: page + 1 }));
        setIsLoadMore(1);
      }
    }
  }, [auth, dispatch, id, isLoadMore, page, result]);

  // Call
  const caller = ({ video }) => {
    const { _id, username, fullname, avatar } = user;
    const msg = {
      sender: auth.user._id,
      recipient: _id,
      username,
      fullname,
      avatar,
      video,
    };

    dispatch({ type: GLOBALTYPES.CALL, payload: msg });
  };

  const callUser = ({ video }) => {
    const { _id, username, fullname, avatar } = auth.user;
    const msg = {
      sender: _id,
      recipient: user._id,
      username,
      fullname,
      avatar,
      video,
    };

    if (peer.open) msg.peerId = peer.id;
    socket.emit("callUser", msg);
  };

  const handleAudioCall = () => {
    caller({ video: false });
    callUser({ video: false });
  };

  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  };

  return (
    <>
      <div className="message_header">
        {user.length !== 0 && (
          <UserCard user={user}>
            <div className="flex items-center gap-2">
              <IoCall
                className="cursor-pointer hover:text-blue-500"
                fontSize={24}
                onClick={handleAudioCall}
              />
              <IoVideocam
                className="cursor-pointer hover:text-blue-500"
                fontSize={24}
                onClick={handleVideoCall}
              />
              <MdDelete
                fontSize={24}
                onClick={handleDeleteConversation}
                className="cursor-pointer hover:text-red-500"
              />
            </div>
          </UserCard>
        )}
      </div>

      <div
        className="chat_container"
        style={{ height: media.length > 0 ? "calc(100% - 220px)" : "" }}
      >
        <div className="chat_display" ref={refDisplay}>
          <button
            disabled
            style={{ marginTop: "-15px", opacity: 0 }}
            ref={pageEnd}
          >
            Load more
          </button>

          {data.map((msg, index) => (
            <div key={index}>
              {/* orther message */}
              {msg.sender !== auth.user._id && (
                <div className="chat_row other_message">
                  <MsgDisplay user={user} msg={msg} data={data} />
                </div>
              )}

              {/* your message */}
              {msg.sender === auth.user._id && (
                <div className="chat_row you_message">
                  <MsgDisplay user={auth.user} msg={msg} data={data} />
                </div>
              )}
            </div>
          ))}
          {loadMedia && (
            <div className="chat_row you_message">
              <img src={LoadIcon} alt="Loading..." />
            </div>
          )}
        </div>
      </div>

      <div
        className="show_media"
        style={{ display: media.length > 0 ? "grid" : "none" }}
      >
        {media.map((img, index) => (
          <div key={index} className="relative mt-1 h-full w-full">
            {img.camera ? (
              imageShow(img.camera)
            ) : img.public_id ? (
              <>
                {img.type.match(/video/i)
                  ? videoShow(img.url)
                  : imageShow(img.url)}
              </>
            ) : (
              <>{img.video ? videoShow(img.video) : imageShow(img.image)}</>
            )}

            <IoMdCloseCircle
              fontSize={20}
              onClick={() => deleteImages(index)}
              className="hover:text-red-700 cursor-pointer absolute top-1 right-1"
            />
          </div>
        ))}
      </div>
      <form className="chat_input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="file_upload" onClick={() => setOpenIcons(false)}>
          <IoMdImages fontSize={30} />
          <input
            type="file"
            id="file"
            multiple
            accept="image/*,video/*"
            onChange={handleChangeMedia}
          />
        </div>

        <Icons
          classname="bottom-[100%] right-0"
          setOpenIcons={setOpenIcons}
          changeIcons={changeIcons}
          openIcons={openIcons}
        />

        <button
          type="submit"
          disabled={text || media.length > 0 ? false : true}
          className={text.length || media.length > 0 ? "text-blue-500" : ""}
        >
          <IoIosSend fontSize={30} />
        </button>
      </form>
    </>
  );
};

export default RightSide;
