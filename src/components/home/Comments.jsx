import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { LuMinusCircle } from "react-icons/lu";
import CommentDisplay from "./comments/CommentDisplay";

const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [replyComments, setReplyComments] = useState([]);

  const [next, setNext] = useState(2);

  useEffect(() => {
    const newCm = post.comments.filter((cm) => !cm.reply);
    setComments(newCm);
    setShowComments(newCm.slice(newCm.length - next));
  }, [next, post.comments]);

  useEffect(() => {
    const newRep = post.comments.filter((cm) => cm.reply);
    setReplyComments(newRep);
  }, [post.comments]);

  return (
    <div>
      {showComments.map((comment) => (
        <CommentDisplay
          comment={comment}
          post={post}
          key={comment._id}
          replyComments={replyComments.filter(
            (item) => item.reply === comment._id
          )}
        />
      ))}

      {comments.length - next > 0 ? (
        <div
          className="w-full flex items-center border p-1 justify-center cursor-pointer"
          onClick={() => setNext(next + 10)}
        >
          <IoMdAddCircle fontSize={20} />
        </div>
      ) : (
        comments.length > 2 && (
          <div
            className="w-full flex items-center border p-1 justify-center cursor-pointer"
            onClick={() => setNext(2)}
          >
            <LuMinusCircle fontSize={20} />
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
