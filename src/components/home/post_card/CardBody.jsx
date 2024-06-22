import React, { useState } from "react";
import Carousel from "../../common/Carousel";
import { IoMdAddCircle } from "react-icons/io";
import { LuMinusCircle } from "react-icons/lu";

const CardBody = ({ post }) => {
  const [readMore, setReadMore] = useState(false);
  return (
    <div className="w-full">
      <div className="pb-2">
        <span>
          {post.content.length < 60
            ? post.content
            : readMore
            ? post.content + ""
            : post.content.slice(0, 60) + "..."}
        </span>
        {post.content.length > 60 && (
          <span onClick={() => setReadMore(!readMore)}>
            {readMore ? (
              <LuMinusCircle
                className="cursor-pointer !inline"
                fontSize={20}
                title="hide"
              />
            ) : (
              <IoMdAddCircle
                className="cursor-pointer !inline"
                fontSize={20}
                title="show more"
              />
            )}
          </span>
        )}
      </div>
      <div className="">
        {post.images.length > 0 && <Carousel images={post.images} />}
      </div>
    </div>
  );
};

export default CardBody;
