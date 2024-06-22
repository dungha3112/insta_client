import moment from "moment";
import React from "react";
import { IoIosMore } from "react-icons/io";
import { PiDotOutlineFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";
import Avatar from "../../common/Avatar";
import ModalMenuPost from "../../modals/ModalMenuPost";

const CardHeader = ({ post }) => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => state);

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Avatar url={post.user.avatar} classname="medium-avatar" />

        <div className="flex items-center">
          <h6 className="m-0">
            <Link to={`/profile/${post.user._id}`}>{post.user.username}</Link>
          </h6>
          <PiDotOutlineFill fontSize={10} />
          <small>{moment(post.createdAt).fromNow()}</small>
        </div>
      </div>

      <div>
        <IoIosMore
          fontSize={20}
          className="cursor-pointer"
          onClick={() =>
            dispatch({
              type: GLOBALTYPES.MODAL,
              payload: { morenenu_post: true, post: post },
            })
          }
          title="More"
        />
      </div>
      {modal.morenenu_post && <ModalMenuPost />}
    </div>
  );
};

export default CardHeader;
