import { getDataAPI, postDataAPI } from "../../utils/fetchData";
import { EXPLORE_TYPES } from "../reducers/exploreReducer";
import { GLOBALTYPES } from "./globalTypes";
import { POST_TYPE } from "./postAction";
import "react-toastify/dist/ReactToastify.css";

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("auth/signin", data);
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        msg: res.data.msg,
        access_token: res.data.access_token,
        user: res.data.user,
      },
    });

    localStorage.setItem("firstLogin", true);
    localStorage.setItem("openBellNotifies", "open");
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
  } catch (error) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
  }
};

export const signUp = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await postDataAPI("auth/signup", data);
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        msg: res.data.msg,
        access_token: res.data.access_token,
        user: res.data.user,
      },
    });
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    localStorage.setItem("firstLogin", true);
  } catch (error) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loadingHomeScreen: true } });
    const res = await getDataAPI("auth/refresh_token", {});
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: res.data,
    });

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { loadingHomeScreen: false },
    });
  } catch (error) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
    localStorage.removeItem("firstLogin");
  }
};

export const loggout =
  ({ auth, socket }) =>
  async (dispatch) => {
    try {
      // dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      socket.emit("checkUserOnline", auth.user);
      await postDataAPI("auth/logout", {}, auth.access_token);
      localStorage.removeItem("firstLogin");
      dispatch({ type: GLOBALTYPES.AUTH, payload: {} });
      dispatch({
        type: EXPLORE_TYPES.GET_POSTS,
        payload: { posts: [], result: 0 },
      });

      dispatch({
        type: POST_TYPE.GET_POSTS,
        payload: { posts: [], result: 0 },
      });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };
