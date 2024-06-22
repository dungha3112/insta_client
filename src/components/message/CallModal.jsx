import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdCallEnd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../common/Avatar";

import { FaVideo } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { addMessage } from "../../redux/actions/messageAction";
import RingRing from "../../assets/audio/message_calling.mp3";

const CallModal = () => {
  const { call, auth, peer, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [mins, setMins] = useState(0);
  const [second, setSecond] = useState(0);
  const [hours, setHours] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [tracks, setTracks] = useState(null);
  const [newCall, setNewCall] = useState(null);

  const youVideo = useRef();
  const otherVideo = useRef();

  // set timer
  useEffect(() => {
    const setTime = () => {
      setTotal((t) => t + 1);
      setTimeout(setTime, 1000);
    };
    setTime();
    return () => setTotal(0);
  }, []);

  useEffect(() => {
    setSecond(total % 60);
    setMins(parseInt(total / 60));
    setHours(parseInt(total / 3600));
  }, [total]);

  const addCallMessage = useCallback(
    (call, times, disconnect) => {
      if (call.recipient !== auth.user._id || disconnect) {
        const msg = {
          sender: call.sender,
          recipient: call.recipient,
          text: "",
          media: [],
          call: { video: call.video, times },
          createdAt: new Date().toISOString(),
        };

        dispatch(addMessage({ msg, auth, socket }));
      }
    },
    [auth, dispatch, socket]
  );

  const handleEndCall = () => {
    tracks && tracks.forEach((track) => track.stop());
    let times = answer ? total : 0;

    socket.emit("endCall", { ...call, times });
    addCallMessage(call, times);

    dispatch({ type: GLOBALTYPES.CALL, payload: null });
  };

  useEffect(() => {
    if (answer) {
      setTotal(0);
    } else {
      const timer = setTimeout(() => {
        socket.emit("endCall", { ...call, times: 0 });
        addCallMessage(call, 0);
        dispatch({ type: GLOBALTYPES.CALL, payload: null });
      }, 28000);
      return () => clearTimeout(timer);
    }
  }, [addCallMessage, answer, call, dispatch, socket]);

  useEffect(() => {
    socket.on("endCallToClient", (data) => {
      tracks && tracks.forEach((track) => track.stop());

      addCallMessage(data, data.times);

      dispatch({ type: GLOBALTYPES.CALL, payload: null });
    });

    return () => socket.off("endCallToClient");
  }, [addCallMessage, call, dispatch, socket, tracks]);

  // stream media
  const openStream = (video) => {
    const config = { audio: true, video };
    return navigator.mediaDevices.getUserMedia(config);
  };

  const playStream = (tag, stream) => {
    let video = tag;
    video.srcObject = stream;
    if (!video.paused) {
      video.pause();
    }

    return video.play().catch((error) => {
      console.error("Error playing video stream:", error);
    });
  };

  // answer call
  const handleAnswer = () => {
    openStream(call.video).then((stream) => {
      playStream(youVideo.current, stream);
      const track = stream.getTracks();
      setTracks(track);

      var newCall = peer.call(call.peerId, stream);
      newCall.on("stream", function (remoteStream) {
        playStream(otherVideo.current, remoteStream);
      });
      setAnswer(true);
      setNewCall(newCall);
    });
  };

  useEffect(() => {
    peer.on("call", (newCall) => {
      openStream(call.video).then((stream) => {
        if (youVideo.current) {
          playStream(youVideo.current, stream);
        }
        const track = stream.getTracks();
        setTracks(track);
        newCall.answer(stream);
        newCall.on("stream", function (remoteStream) {
          if (otherVideo.current) {
            playStream(otherVideo.current, remoteStream);
          }
        });
        setAnswer(true);
        setNewCall(newCall);
      });
    });

    return () => peer.removeListener("call");
  }, [call.video, peer]);

  // caller Disconnect
  useEffect(() => {
    socket.on("callerDisconnect", () => {
      tracks && tracks.forEach((track) => track.stop());

      let times = answer ? total : 0;
      addCallMessage(call, times, true);

      dispatch({ type: GLOBALTYPES.CALL, payload: null });
      alert("err: user disconnect");
    });
    return () => socket.off("callerDisconnect");
  }, [addCallMessage, answer, call, dispatch, socket, total, tracks]);

  // play - pause audio
  const playAudio = (newAudio) => {
    newAudio.play().catch((error) => {
      console.log("Error playing audio:", error);
    });
  };

  const pauseAudio = (newAudio) => {
    newAudio.pause();
    newAudio.currentTime = 0;
  };

  useEffect(() => {
    let newAudio = new Audio(RingRing);
    if (answer) {
      pauseAudio(newAudio);
    } else {
      playAudio(newAudio);
    }
  }, [answer]);

  return (
    <div className="modal_call">
      <div
        className="call_box"
        style={{
          display: answer && call.video ? "none" : "flex",
        }}
      >
        <div className="text-center py-8">
          <Avatar url={call.avatar} classname="supper-avatar" />
          <h4 className="font-bold text-xl">{call.username}</h4>
          <h6 className="font-bold text-sm">{call.fullname}</h6>

          {answer ? (
            <div>
              <span>{hours.toString().length < 2 ? "0" + hours : hours}</span>
              <span>:</span>
              <span>{mins.toString().length < 2 ? "0" + mins : mins}</span>
              <span>:</span>
              <span>
                {second.toString().length < 2 ? "0" + second : second}
              </span>
            </div>
          ) : (
            <div>
              {call.video ? (
                <span>call video ...</span>
              ) : (
                <span>call audio ...</span>
              )}
            </div>
          )}
        </div>

        {!answer && (
          <div className="timer">
            <small>{mins.toString().length < 2 ? "0" + mins : mins}</small>
            <small>:</small>
            <small>
              {second.toString().length < 2 ? "0" + second : second}
            </small>
          </div>
        )}

        <div className="call_menu">
          <MdCallEnd
            className="rounded-full bg-[#ccc] p-2 cursor-pointer text-red-500"
            fontSize={50}
            onClick={handleEndCall}
          />
          {call.recipient === auth.user._id && !answer && (
            <>
              {call.video ? (
                <FaVideo
                  className="rounded-full bg-[#ccc] p-2 cursor-pointer text-green-500"
                  fontSize={50}
                  onClick={handleAnswer}
                />
              ) : (
                <IoCall
                  className="rounded-full bg-[#ccc] p-2 cursor-pointer text-green-500"
                  fontSize={50}
                  onClick={handleAnswer}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div
        className="show_video"
        style={{ opacity: answer && call.video ? "1" : "0" }}
      >
        <video ref={youVideo} className="you_video" />
        <video ref={otherVideo} className="other_video" />

        <div className="time_video">
          <small>{hours.toString().length < 2 ? "0" + hours : hours}</small>
          <small>:</small>
          <small>{mins.toString().length < 2 ? "0" + mins : mins}</small>
          <small>:</small>
          <small>{second.toString().length < 2 ? "0" + second : second}</small>
        </div>

        <MdCallEnd
          className="end_call p-2"
          fontSize={50}
          onClick={handleEndCall}
        />
      </div>
    </div>
  );
};

export default CallModal;
