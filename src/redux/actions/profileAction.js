import {
  getDataAPI,
  patchDataAPI,
  postDataAPI,
  putDataAPI,
} from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
import { PROFILE_TYPES } from "../reducers/profileReducer";
import { DeleteData, GLOBALTYPES } from "./globalTypes";
import { createNotify, removeNotify } from "./notifyAction";

export const getProfileUsers =
  ({ id, auth }) =>
  async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id });
    try {
      dispatch({ type: PROFILE_TYPES.LOADING, payload: true });

      const res = getDataAPI(`user/${id}`, auth.access_token);
      const res1 = getDataAPI(`post/user_posts/${id}`, auth.access_token);

      const users = await res;
      const posts = await res1;

      dispatch({ type: PROFILE_TYPES.LOADING, payload: false });

      dispatch({ type: PROFILE_TYPES.GET_USER, payload: { user: users.data } });
      dispatch({
        type: PROFILE_TYPES.GET_POSTS,
        payload: { ...posts.data, _id: id, page: 2 },
      });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const updateProfile =
  ({ data, avatar, auth }) =>
  async (dispatch) => {
    try {
      let media;
      if (avatar) media = await imageUpload([avatar]);
      await putDataAPI(
        "user/update-profile",
        { ...data, avatar: avatar ? media[0].url : auth.user.avatar },
        auth.access_token
      );

      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...data,
            avatar: avatar ? media[0].url : auth.user.avatar,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const updatePassword = (data, auth) => async (dispatch) => {
  try {
    await putDataAPI(`user/update-password`, data, auth.access_token);

    await postDataAPI("auth/logout", {}, auth.access_token);
    localStorage.removeItem("firstLogin");
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {},
    });
  } catch (error) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
  }
};

export const follow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    let newUser;

    if (users.every((item) => item._id !== user._id)) {
      newUser = { ...user, followers: [...user.followers, auth.user] };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = { ...item, followers: [...item.followers, auth.user] };
        }
      });
    }
    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser });
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: { ...auth.user, following: [...auth.user.following, newUser] },
      },
    });

    try {
      const res = await patchDataAPI(
        `user/${user._id}/follow`,
        {},
        auth.access_token
      );

      // socket
      socket.emit("follow", res.data.newUser);

      // Notify
      const msg = {
        id: auth.user._id,
        text: "Has started follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
        image: auth.user.avatar,
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const unfollow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    let newUser;
    if (users.every((item) => item._id !== user._id)) {
      newUser = {
        ...user,
        followers: DeleteData(user.followers, auth.user._id),
      };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = {
            ...item,
            followers: DeleteData(item.followers, auth.user._id),
          };
        }
      });
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser });

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: DeleteData(auth.user.following, newUser._id),
        },
      },
    });

    try {
      const res = await patchDataAPI(
        `user/${user._id}/unfollow`,
        {},
        auth.access_token
      );

      // socket
      socket.emit("unFollow", res.data.newUser);

      // Notifies
      const msg = {
        id: auth.user._id,
        text: "Has started to follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };
      dispatch(removeNotify({ msg, auth, socket }));
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };
