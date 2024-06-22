import React, { useEffect, useRef, useState } from "react";
import { IoMdCamera, IoMdCloseCircle, IoMdImages } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { createPost, updatePost } from "../../redux/actions/postAction";
import TextButton from "../common/TextButton";
import ImagesShow from "../createPost/ImagesShow";
import TextareaInput from "../createPost/TextareaInput";
import Icons from "../common/Icons";

const ModalCreatePost = () => {
  const dispatch = useDispatch();
  const { auth, modal, socket } = useSelector((state) => state);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const [stream, setStream] = useState(false);
  const videoRef = useRef();
  const refCanvas = useRef();
  const [tracks, setTracks] = useState("");

  const [openIcons, setOpenIcons] = useState(false);

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let newImages = [];
    files.forEach((file) => {
      if (!file) return alert("File does not exist.");
      if (file.type.match(/video/i)) {
        return newImages.push({
          video: URL.createObjectURL(file),
          file: file,
        });
      } else {
        return newImages.push({
          image: URL.createObjectURL(file),
          file: file,
        });
      }
    });
    setImages([...images, ...newImages]);
  };

  const handleStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();

          const track = mediaStream.getTracks();
          setTracks(track[0]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);
    const ctx = refCanvas.current.getContext("2d");

    ctx.drawImage(videoRef.current, 0, 0, width, height);
    let URL = refCanvas.current.toDataURL();
    setImages([...images, { camera: URL }]);
  };

  const handleStopStream = () => {
    tracks.stop();
    setStream(false);
  };

  const handleCloseModal = () => {
    if (stream) {
      tracks.stop();
      setStream(false);
    }
    dispatch({
      type: GLOBALTYPES.MODAL,
      payload: { create: false, post: {}, onEdit: false, icons: false },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modal.onEdit) {
      await dispatch(updatePost({ content, images, auth, post: modal.post }));
    } else {
      await dispatch(createPost({ content, images, auth, socket }));
    }
    setContent("");
    setImages([]);
    handleCloseModal();
    setOpenIcons(false);
  };

  const changeIcons = async (e) => {
    const sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);

    setContent(content ? content + emoji : emoji);
  };

  useEffect(() => {
    if (modal.onEdit) {
      setContent(modal.post.content);
      setImages(modal.post.images);
    }
  }, [modal.onEdit, modal.post.content, modal.post.images]);

  return (
    <div className="fixed z-[99999999] inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg w-[450px] h-[calc(100vh-32px)] overflow-auto">
        <form action="" className="p-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between py-2">
            <h1 className="text-center text-lg uppercase font-bold">
              {modal.onEdit ? "Edit post" : "Create new post"}
            </h1>
            <IoMdCloseCircle
              fontSize={22}
              className="hover:text-red-700 cursor-pointer"
              onClick={handleCloseModal}
            />
          </div>
          <div>
            <TextareaInput content={content} setContent={setContent} />

            <ImagesShow images={images} setImages={setImages} />
            {stream && (
              <div className="relative">
                <video
                  autoPlay
                  muted
                  ref={videoRef}
                  width="100%"
                  height="100%"
                />
                <IoMdCloseCircle
                  fontSize={20}
                  className="hover:text-red-700 cursor-pointer absolute top-2 right-2"
                  onClick={handleStopStream}
                />
                <canvas ref={refCanvas} style={{ display: "none" }} />
              </div>
            )}
            <div className="flex justify-center mx-1">
              {stream ? (
                <IoMdCamera
                  fontSize={30}
                  className="cursor-pointer text-red-500"
                  onClick={handleCapture}
                />
              ) : (
                <>
                  <IoMdCamera
                    fontSize={30}
                    className="cursor-pointer"
                    onClick={handleStream}
                  />
                  <div className="overflow-hidden mx-1 relative">
                    <IoMdImages fontSize={30} className="cursor-pointer" />
                    <input
                      type="file"
                      name="file"
                      id="file"
                      multiple
                      accept="image/*,video/*"
                      className="absolute top-0 left-0 opacity-0"
                      onChange={handleChangeMedia}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <Icons
            setOpenIcons={setOpenIcons}
            openIcons={openIcons}
            changeIcons={changeIcons}
            classname="left-0 bottom-[100%]"
          />
          <TextButton type="submit" title={modal.onEdit ? "Edit" : "Post"} />
        </form>
      </div>
    </div>
  );
};

export default ModalCreatePost;
