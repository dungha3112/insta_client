import React, { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import { IoMdAddCircle } from "react-icons/io";
import { LuMinusCircle } from "react-icons/lu";

const CommentDisplay = ({ comment, post, replyComments }) => {
  const [showRep, setShowRep] = useState([]);
  const [next, setNext] = useState(1);

  useEffect(() => {
    setShowRep(replyComments.slice(replyComments.length - next));
  }, [replyComments, next]);

  return (
    <div className="p-1">
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div className="pl-2">
          {showRep.map((item, index) => (
            <CommentCard
              key={index}
              comment={item}
              post={post}
              commentId={comment._id}
            />
          ))}

          {replyComments.length - next > 0 ? (
            <div
              className="w-full flex items-center border p-1 mt-2 justify-center cursor-pointer"
              onClick={() => setNext(next + 10)}
            >
              <IoMdAddCircle fontSize={20} />
            </div>
          ) : (
            replyComments.length > 1 && (
              <div
                className="w-full flex items-center border p-1 mt-2 justify-center cursor-pointer"
                onClick={() => setNext(1)}
              >
                <LuMinusCircle fontSize={20} />
              </div>
            )
          )}
        </div>
      </CommentCard>
    </div>
  );
};

export default CommentDisplay;
