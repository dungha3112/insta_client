import React from "react";
import CardHeader from "../home/post_card/CardHeader";
import CardBody from "../home/post_card/CardBody";
import CardFooter from "../home/post_card/CardFooter";
import Comments from "../home/Comments";
import InputComment from "./InputComment";

const PostCard = ({ post }) => {
  return (
    post && (
      <div key={post._id} className="flex flex-col gap-1 w-full">
        <CardHeader post={post} />
        <CardBody post={post} />
        <CardFooter post={post} />

        <Comments post={post} />
        <InputComment post={post} />
        <div className="border-b pt-4"></div>
      </div>
    )
  );
};

export default PostCard;
