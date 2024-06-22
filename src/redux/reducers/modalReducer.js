import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  search: false,
  noti: false,
  create: false,
  confirm: false,
  follow: false,
  following: false,
  morenenu_post: false,
  onEdit: false,
  likes: false,
  post: {},
  userLikes: [],

  icons: false,
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.MODAL:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default modalReducer;
