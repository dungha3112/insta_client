import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = { loadingHomeScreen: false };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.ALERT:
      return action.payload;
    default:
      return state;
  }
};

export default authReducer;
