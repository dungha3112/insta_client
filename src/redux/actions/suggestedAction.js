import { getDataAPI } from "../../utils/fetchData";
import { SUGGES_TYPES } from "../reducers/suggestedReducer";

export const getSuggestions = (token) => async (dispatch) => {
  try {
    dispatch({ type: SUGGES_TYPES.LOADING, payload: true });

    const res = await getDataAPI(`user/suggestions`, token);
    dispatch({ type: SUGGES_TYPES.GET_USERS, payload: res.data });

    dispatch({ type: SUGGES_TYPES.LOADING, payload: false });
  } catch (error) {}
};
