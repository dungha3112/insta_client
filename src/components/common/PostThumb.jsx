import React from "react";
import { Link } from "react-router-dom";
import { FaRegComment } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";

const PostThumb = ({ posts, result }) => {
  if (Number(result) === 0)
    return (
      <h2 className="text-center text-xl font-bold text-red-600">No Post</h2>
    );

  return (
    <div className="post_thumb">
      {posts.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <div className="post_thumb_display">
            {post.images[0].url.match(/video/i) ? (
              <video
                controls
                src={post.images[0].url}
                alt={post.images[0].url}
              />
            ) : (
              <img src={post.images[0].url} alt={post.images[0].url} />
            )}

            <div className="post_thumb_menu flex items-center gap-4">
              <span className="flex items-center gap-1 text-xl text-white">
                <FaRegHeart />

                {post.likes.length}
              </span>

              <span className="flex items-center gap-1 text-xl text-white">
                <FaRegComment />
                {post.comments.length}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostThumb;
