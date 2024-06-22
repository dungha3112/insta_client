import {
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
  postDataAPI,
} from "../../utils/fetchData";
import { DeleteData, EditData, GLOBALTYPES } from "./globalTypes";
import { createNotify, removeNotify } from "./notifyAction";
import { POST_TYPE } from "./postAction";

export const createComment =
  ({ newComment, post, auth, socket }) =>
  async (dispatch) => {
    const newPost = { ...post, comments: [...post.comments, newComment] };
    dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    try {
      const data = {
        ...newComment,
        postId: post._id,
        postUserId: post.user._id,
      };
      const res = await postDataAPI(`comment`, data, auth.access_token);

      const newData = { ...res.data.newComment, user: auth.user };
      const newPost = { ...post, comments: [...post.comments, newData] };
      dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });

      // socket
      socket.emit("createComment", newPost);

      // Notify
      const msg = {
        id: res.data.newComment._id,
        text: newComment.reply
          ? "Mentioned you in a comment"
          : "Has commented on your post",
        recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
        url: `/post/${post._id}`,
        content: post.content,
        image: post.images[0].url,
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (error) {}
  };

export const updateComment =
  ({ comment, post, content, auth }) =>
  async (dispatch) => {
    const newComments = EditData(post.comments, comment._id, {
      ...comment,
      content,
    });
    const newPost = { ...post, comments: newComments };
    dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    try {
      await patchDataAPI(
        `comment/${comment._id}`,
        { content },
        auth.access_token
      );
    } catch (error) {}
  };

export const likeComment =
  ({ comment, post, auth, socket }) =>
  async (dispatch) => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] };
    const newComments = EditData(post.comments, comment._id, newComment);

    const newPost = { ...post, comments: newComments };
    dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    socket.emit("likeComment", newPost);

    try {
      await patchDataAPI(`comment/${comment._id}/like`, {}, auth.access_token);

      // Notify
      const msg = {
        id: comment._id,
        text: "Like your comment",
        recipients: [comment.user._id],
        url: `/post/${post._id}`,
        content: comment.content,
        image: post.images[0].url,
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (error) {}
  };

export const unLikeComment =
  ({ comment, post, auth, socket }) =>
  async (dispatch) => {
    const newComment = {
      ...comment,
      likes: DeleteData(comment.likes, auth.user._id),
    };
    const newComments = EditData(post.comments, comment._id, newComment);

    const newPost = { ...post, comments: newComments };
    dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });
    socket.emit("unLikeComment", newPost);

    try {
      await patchDataAPI(
        `comment/${comment._id}/unlike`,
        {},
        auth.access_token
      );
      // Notify
      const msg = {
        id: comment._id,
        text: "Like your comment",
        recipients: [comment.user._id],
        url: `/post/${post._id}`,
      };
      dispatch(removeNotify({ msg, auth, socket }));
    } catch (error) {}
  };

export const getUserLikeComment =
  ({ comment, auth }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `comment/getlikes/${comment._id}`,
        auth.access_token
      );
      dispatch({
        type: GLOBALTYPES.MODAL,
        payload: { likes: true, userLikes: res.data },
      });
    } catch (error) {}
  };

export const deleteComment =
  ({ post, auth, comment, socket }) =>
  async (dispatch) => {
    const deleteArr = [
      ...post.comments.filter((cm) => cm.reply === comment._id),
      comment,
    ];
    const newPost = {
      ...post,
      comments: post.comments.filter(
        (cm) => !deleteArr.find((da) => cm._id === da._id)
      ),
    };

    dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });

    // socket
    socket.emit("deleteComment", newPost);
    try {
      await deleteArr.forEach((item) => {
        deleteDataAPI(`comment/${item._id}`, auth.access_token);

        const msg = {
          id: item._id,
          recipients: comment.reply ? [comment.tag._id] : [post.user._id],
          url: `/post/${post._id}`,
        };

        dispatch(removeNotify({ msg, auth, socket }));
      });
    } catch (error) {}
  };
