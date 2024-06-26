import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = [];

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.SOCKET:
      return action.payload;
    default:
      return state;
  }
};

export default socketReducer;
