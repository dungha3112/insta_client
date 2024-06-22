import { deleteDataAPI, getDataAPI, postDataAPI } from "../../utils/fetchData";
import { MESSAGE_TYPES } from "../reducers/messageReducer";
import { DeleteData } from "./globalTypes";

export const addMessage =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    const { _id, avatar, fullname, username } = auth.user;
    socket.emit("addMessage", {
      ...msg,
      user: { _id, avatar, fullname, username },
    });
    try {
      const res = await postDataAPI(`message`, msg, auth.access_token);
      dispatch({
        type: MESSAGE_TYPES.ADD_MESSAGE,
        payload: { ...msg, _id: res.data.newMessage._id },
      });
    } catch (error) {}
  };

export const getConversations =
  ({ auth, page = 1 }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `conversations?limit=${page * 9}`,
        auth.access_token
      );

      let newArr = [];
      res.data.conversations.forEach((item) => {
        item.recipients.forEach((cv) => {
          if (cv._id !== auth.user._id) {
            newArr.push({
              ...cv,
              text: item.text,
              media: item.media,
              call: item.call,
            });
          }
        });
      });
      dispatch({
        type: MESSAGE_TYPES.GET_CONVERSATIONS,
        payload: { newArr, result: res.data.result },
      });
    } catch (error) {}
  };

export const getMessages =
  ({ id, auth, page = 1 }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `message/${id}?limit=${page * 9}`,
        auth.access_token
      );

      const newData = { ...res.data, messages: res.data.messages.reverse() };
      dispatch({
        type: MESSAGE_TYPES.GET_MESSAGES,
        payload: { ...newData, _id: id, page },
      });
    } catch (error) {}
  };

export const loadMoreMessage =
  ({ auth, id, page = 1 }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `message/${id}?limit=${page * 9}`,
        auth.access_token
      );

      const newData = { ...res.data, messages: res.data.messages.reverse() };
      dispatch({
        type: MESSAGE_TYPES.UPDATE_MESSAGES,
        payload: { ...newData, _id: id, page },
      });
    } catch (error) {}
  };

export const deleteMessage =
  ({ msg, data, auth, socket }) =>
  async (dispatch) => {
    const newData = DeleteData(data, msg._id);
    dispatch({
      type: MESSAGE_TYPES.DELETE_MESSAGES,
      payload: { newData, _id: msg.recipient },
    });
    socket.emit("deleteMessage", {
      newData,
      _id: msg.recipient,
      sender: msg.sender,
    });

    try {
      await deleteDataAPI(`message/${msg._id}`, auth.access_token);
    } catch (error) {}
  };

export const deleteConversation =
  ({ id, auth }) =>
  async (dispatch) => {
    dispatch({ type: MESSAGE_TYPES.DELETE_CONVERSATION, payload: id });
    try {
      await deleteDataAPI(`conversation/${id}`, auth.access_token);
    } catch (error) {}
  };
