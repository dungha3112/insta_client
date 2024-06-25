import {
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
  postDataAPI,
} from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
import { GLOBALTYPES } from "./globalTypes";
import { createNotify, removeNotify } from "./notifyAction";

export const POST_TYPE = {
  LOADING_POSTS: "LOADING_POSTS",
  CREATE_POST: "CREATE_POST",
  UPDATE_POST: "UPDATE_POST",
  GET_POSTS: "GET_POSTS",
  GET_POST: "GET_POST",
  DELETE_POST: "DELETE_POST",
};

export const createPost =
  ({ content, images, auth, socket }) =>
  async (dispatch) => {
    let media = [];
    try {
      if (images.length > 0) media = await imageUpload(images);

      const res = await postDataAPI(
        "posts",
        { content, images: media },
        auth.access_token
      );

      dispatch({
        type: POST_TYPE.CREATE_POST,
        payload: { ...res.data.newPost, user: auth.user },
      });

      // Notify
      const msg = {
        id: res.data.newPost._id,
        text: "Added a new post",
        recipients: res.data.newPost.user.followers,
        url: `/post/${res.data.newPost._id}`,
        content,
        image: media[0].url,
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const updatePost =
  ({ content, images, auth, post }) =>
  async (dispatch) => {
    let media = [];
    const imageNewUrl = images.filter((img) => !img.url);
    const imageOldUrl = images.filter((img) => img.url);

    if (
      post.content === content &&
      imageNewUrl.length === 0 &&
      imageOldUrl.length === post.images.length
    )
      return;
    try {
      if (imageNewUrl.length > 0) media = await imageUpload(imageNewUrl);

      const res = await patchDataAPI(
        `post/${post._id}`,
        { content, images: [...imageOldUrl, ...media] },
        auth.access_token
      );
      dispatch({
        type: POST_TYPE.UPDATE_POST,
        payload: { ...res.data.post, user: auth.user },
      });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const getPosts = (access_token) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPE.LOADING_POSTS, payload: true });

    const res = await getDataAPI(`posts`, access_token);

    dispatch({ type: POST_TYPE.GET_POSTS, payload: { ...res.data, page: 2 } });
    dispatch({ type: POST_TYPE.LOADING_POSTS, payload: false });
  } catch (error) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
  }
};

export const getPost =
  ({ detailPost, id, auth }) =>
  async (dispatch) => {
    if (detailPost.every((post) => post._id !== id)) {
      try {
        const res = await getDataAPI(`post/${id}`, auth.access_token);

        dispatch({ type: POST_TYPE.GET_POST, payload: res.data.post });
      } catch (error) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: error.response.data.msg },
        });
      }
    }
  };

export const likePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const newPost = { ...post, likes: [...post.likes, auth.user._id] };
    dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });

    // socket
    socket.emit("likePost", newPost);
    try {
      await patchDataAPI(`post/${post._id}/like`, {}, auth.access_token);

      // Notify
      const msg = {
        id: auth.user._id,
        text: "Like your post.",
        recipients: [post.user._id],
        url: `/post/${post._id}`,
        content: post.content,
        image: post.images[0].url,
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const unLikePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      likes: post.likes.filter((item) => item !== auth.user._id),
    };
    dispatch({ type: POST_TYPE.UPDATE_POST, payload: newPost });

    // socket
    socket.emit("unLikePost", newPost);
    try {
      await patchDataAPI(`post/${post._id}/unlike`, {}, auth.access_token);

      // Notify
      const msg = {
        id: auth.user._id,
        text: "Like your post.",
        recipients: [post.user._id],
        url: `/post/${post._id}`,
      };
      dispatch(removeNotify({ msg, auth, socket }));
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const getUserLike =
  ({ id, auth }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(`post/${id}/like`, auth.access_token);
      dispatch({
        type: GLOBALTYPES.MODAL,
        payload: { likes: true, userLikes: res.data },
      });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const deletePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await deleteDataAPI(`post/${post._id}`, auth.access_token);

      dispatch({
        type: GLOBALTYPES.MODAL,
        payload: {
          onEdit: false,
          morenenu_post: false,
          create: false,
          post: {},
          confirm: false,
        },
      });

      // Notify
      const msg = {
        id: post._id,
        text: "Added a new post",
        recipients: res.data.newPost.user.followers,
        url: `/post/${post._id}`,
      };
      dispatch(removeNotify({ msg, auth, socket }));
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const savePost =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = { ...auth.user, saved: [...auth.user.saved, post._id] };
    dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
    try {
      await patchDataAPI(`post/${post._id}/save`, {}, auth.access_token);
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const unSavePost =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = {
      ...auth.user,
      saved: auth.user.saved.filter((id) => id !== post._id),
    };
    dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
    try {
      await patchDataAPI(`post/${post._id}/unsave`, {}, auth.access_token);
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };
