import { getDataAPI } from "../../utils/fetchData";
import { EXPLORE_TYPES } from "../reducers/exploreReducer";

export const getExplorePosts = (token) => async (dispatch) => {
  try {
    dispatch({ type: EXPLORE_TYPES.LOADING, payload: true });
    const res = await getDataAPI(`post/explore_posts`, token);

    dispatch({ type: EXPLORE_TYPES.GET_POSTS, payload: res.data });
    dispatch({ type: EXPLORE_TYPES.LOADING, payload: false });
  } catch (error) {}
};
