import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { POST_TYPE } from "../redux/actions/postAction";
import { NOTIFY_TYPES } from "../redux/reducers/notifyReducer";
import audioBell from "../assets/audio/got-it-done-613.mp3";
import { MESSAGE_TYPES } from "../redux/reducers/messageReducer";

const spawnNotification = (body, icon, url, title) => {
  let options = {
    body,
    icon,
  };
  let n = new Notification(title, options);

  n.onclick = (e) => {
    e.preventDefault();
    window.open(url, "_blank");
  };
};
const SocketClient = () => {
  const { auth, socket, notify, online } = useSelector((state) => state);
  const dispatch = useDispatch();
  const audioRef = useRef();
  // joinUser
  useEffect(() => {
    socket.emit("joinUser", auth.user);
  }, [socket, auth.user]);

  // likePost
  useEffect(() => {
    socket.on("likeToClient", (newPost) => {
      dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("likeToClient");
  }, [dispatch, socket]);

  // unLike
  useEffect(() => {
    socket.on("unLikeToClient", (newPost) => {
      dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("unLikeToClient");
  }, [dispatch, socket]);

  // createCommentToClient
  useEffect(() => {
    socket.on("createCommentToClient", (newPost) => {
      dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("createCommentToClient");
  }, [dispatch, socket]);

  // deleteCommentToClient
  useEffect(() => {
    socket.on("deleteCommentToClient", (newPost) => {
      dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("deleteCommentToClient");
  }, [dispatch, socket]);

  // likeCommentToClient
  useEffect(() => {
    socket.on("likeCommentToClient", (newPost) => {
      dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("likeCommentToClient");
  }, [dispatch, socket]);

  // unLikeCommentToClient
  useEffect(() => {
    socket.on("unLikeCommentToClient", (newPost) => {
      dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("unLikeCommentToClient");
  }, [dispatch, socket]);

  // followToClient
  useEffect(() => {
    socket.on("followToClient", (newUser) => {
      dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
    });

    return () => socket.off("followToClient");
  }, [auth, dispatch, socket]);

  // unFollowToClient
  useEffect(() => {
    socket.on("unFollowToClient", (newUser) => {
      dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
    });

    return () => socket.off("unFollowToClient");
  }, [auth, dispatch, socket]);

  // createNotifyToClient
  useEffect(() => {
    socket.on("createNotifyToClient", (msg) => {
      dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg });
      if (notify.sound) audioRef.current.play();
      spawnNotification(
        msg.user.username + " " + msg.text,
        msg.user.avatar,
        msg.url,
        "Instagram"
      );
    });

    return () => socket.off("createNotifyToClient");
  }, [dispatch, notify.sound, socket]);

  // removeNotifyToClient
  useEffect(() => {
    socket.on("removeNotifyToClient", (msg) => {
      dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg });
    });

    return () => socket.off("removeNotifyToClient");
  }, [dispatch, socket]);

  // addMessageToClient
  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
      dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: msg });
      dispatch({
        type: MESSAGE_TYPES.ADD_USER,
        payload: { ...msg.user, text: msg.text, media: msg.media },
      });
    });

    return () => socket.off("addMessageToClient");
  }, [dispatch, socket]);

  // deleteMessageToClient
  useEffect(() => {
    socket.on("deleteMessageToClient", async (msg) => {
      await dispatch({
        type: MESSAGE_TYPES.DELETE_MESSAGES,
        payload: { newData: msg.newData, _id: msg.sender },
      });
    });

    return () => socket.off("deleteMessageToClient");
  }, [dispatch, socket]);

  // Check User Online / Offline

  useEffect(() => {
    socket.emit("checkUserOnline", auth.user);
  }, [auth.user, socket]);

  useEffect(() => {
    socket.on("checkUserOnlineToMe", (data) => {
      data.forEach((item) => {
        if (!online.includes(item.id)) {
          dispatch({ type: GLOBALTYPES.ONLINE, payload: item.id });
        }
      });
    });

    return () => socket.off("checkUserOnlineToMe");
  }, [dispatch, online, socket]);

  useEffect(() => {
    socket.on("checkUserOnlineToClient", (id) => {
      if (!online.includes(id)) {
        dispatch({ type: GLOBALTYPES.ONLINE, payload: id });
      }
    });

    return () => socket.off("checkUserOnlineToClient");
  }, [dispatch, online, socket]);

  // Check User Offline
  useEffect(() => {
    socket.on("checkUserOffline", (id) => {
      dispatch({ type: GLOBALTYPES.OFFLINE, payload: id });
    });

    return () => socket.off("checkUserOffline");
  }, [dispatch, socket]);

  // Call

  useEffect(() => {
    socket.on("callUserToClient", (data) => {
      dispatch({ type: GLOBALTYPES.CALL, payload: data });
    });
    return () => socket.off("callUserToClient");
  }, [dispatch, socket]);

  // Busy call
  useEffect(() => {
    socket.on("userBusy", (data) => {
      // dispatch({
      //   type: GLOBALTYPES.ALERT,
      //   payload: { error: `${call.username} is busy!` },
      // });
    });
    return () => socket.off("userBusy");
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("endCallToClient", (data) => {
      dispatch({ type: GLOBALTYPES.CALL, payload: null });
    });

    return () => socket.off("endCallToClient");
  }, [dispatch, socket]);

  return (
    <>
      <audio controls ref={audioRef} style={{ display: "none" }}>
        <source src={audioBell} type="audio/mp3" />
      </audio>
    </>
  );
};

export default SocketClient;
