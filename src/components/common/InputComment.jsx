import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../redux/actions/commentAction";
import Icons from "./Icons";

const InputComment = ({ children, post, setOnReply, onReply }) => {
  const [content, setContent] = useState("");
  const [load, setLoad] = useState("");
  const dispatch = useDispatch();
  const { auth, socket, modal } = useSelector((state) => state);
  const [openIcons, setOpenIcons] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      if (setOnReply) return setOnReply(false);
      return;
    }

    if (load) return;
    setLoad(true);
    const newComment = {
      content,
      likes: [],
      user: auth.user,
      createdAt: new Date().toISOString(),
      reply: onReply && onReply.commentId,
      tag: onReply && onReply.user,
    };
    await dispatch(createComment({ newComment, post, auth, socket }));

    setLoad(false);
    if (setOnReply) return setOnReply(false);
    setContent("");
    setOpenIcons(false);
  };

  const changeIcons = async (e) => {
    const sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);

    setContent(content ? content + emoji : emoji);
  };
  return (
    <form className="flex items-center bg-[#f7f7f7]" onSubmit={handleSubmit}>
      {children}
      <input
        type="text"
        placeholder="Add your comments..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className=" border-none outline-none bg-[#f7f7f7] p-3 flex-1 overflow-auto"
      />

      {!modal.create && (
        <Icons
          setOpenIcons={setOpenIcons}
          openIcons={openIcons}
          changeIcons={changeIcons}
          classname="right-0 bottom-[100%]"
        />
      )}

      <button
        type="submit"
        className="border-none outline-none bg-[#f7f7f7] p-3 text-green-500 font-sans"
      >
        Post
      </button>
    </form>
  );
};

export default InputComment;
