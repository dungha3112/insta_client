import { DeleteData, EditData } from "../actions/globalTypes";

export const NOTIFY_TYPES = {
  GET_NOTIFIES: "GET_NOTIFIES",
  LOADING_NOTIFIES: "LOADING_NOTIFIES",
  UPDATE_NOTIFIES: "UPDATE_NOTIFIES",
  DELETE_NOTIFY: "DELETE_NOTIFY",
  CREATE_NOTIFY: "CREATE_NOTIFY",
  REMOVE_NOTIFY: "REMOVE_NOTIFY",

  UPDATE_SOUND: "UPDATE_SOUND",
  DELETE_NOTIFIES: "DELETE_NOTIFIES",
};

const initialState = {
  loading: false,
  data: [],
  sound: false,
};

const notifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFY_TYPES.GET_NOTIFIES:
      return { ...state, data: action.payload };

    case NOTIFY_TYPES.CREATE_NOTIFY:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };

    case NOTIFY_TYPES.UPDATE_NOTIFIES:
      return {
        ...state,
        data: EditData(state.data, action.payload._id, action.payload),
      };

    case NOTIFY_TYPES.REMOVE_NOTIFY:
      return {
        ...state,
        data: state.data.filter(
          (item) =>
            item.id !== action.payload.id || item.url !== action.payload.url
        ),
      };

    case NOTIFY_TYPES.UPDATE_SOUND:
      return { ...state, sound: action.payload };

    case NOTIFY_TYPES.DELETE_NOTIFY:
      return {
        ...state,
        data: DeleteData(state.data, action.payload._id),
      };

    case NOTIFY_TYPES.DELETE_NOTIFIES:
      return { ...state, data: [] };
    default:
      return state;
  }
};

export default notifyReducer;
