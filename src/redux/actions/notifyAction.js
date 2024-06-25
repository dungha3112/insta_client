import {
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
  postDataAPI,
} from "../../utils/fetchData";
import { NOTIFY_TYPES } from "../reducers/notifyReducer";
import { GLOBALTYPES } from "./globalTypes";

export const createNotify =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await postDataAPI(`notify`, msg, auth.access_token);

      // socket
      socket.emit("createNotify", {
        ...res.data.newNotify,
        user: { username: auth.user.username, avatar: auth.user.avatar },
      });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const removeNotify =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    try {
      await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, auth.access_token);

      // socket
      socket.emit("removeNotify", msg);

      // const res = await getDataAPI(`notifies`, auth.access_token);
      // dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const getNotifies = (access_token) => async (dispatch) => {
  try {
    const res = await getDataAPI(`notifies`, access_token);
    dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies });
  } catch (error) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
  }
};

export const readNotify =
  ({ msg, auth }) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI(
        `notify/read/${msg._id}`,
        {},
        auth.access_token
      );
      dispatch({ type: GLOBALTYPES.MODAL, payload: { noti: false } });

      dispatch({
        type: NOTIFY_TYPES.UPDATE_NOTIFIES,
        payload: { ...res.data.readNotify, user: auth.user },
      });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const deleteANotify =
  ({ msg, auth }) =>
  async (dispatch) => {
    try {
      await patchDataAPI(`notify/delete/${msg._id}`, {}, auth.access_token);
      dispatch({ type: NOTIFY_TYPES.DELETE_NOTIFY, payload: msg });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

export const deleteAllNotifies =
  ({ token, setIsDeleteAll }) =>
  async (dispatch) => {
    try {
      await deleteDataAPI(`notifies`, token);
      setIsDeleteAll(false);
      dispatch({ type: NOTIFY_TYPES.DELETE_NOTIFIES, payload: [] });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };
