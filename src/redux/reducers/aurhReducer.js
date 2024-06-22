import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = { msg: "", access_token: "", user: {} };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.AUTH:
      return action.payload;
    default:
      return state;
  }
};

export default authReducer;
