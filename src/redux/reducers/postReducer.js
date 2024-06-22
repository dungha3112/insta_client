import { DeleteData, EditData } from "../actions/globalTypes";
import { POST_TYPE } from "../actions/postAction";

const initialState = {
  loading: false,
  result: 0,
  posts: [],
  page: 2,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TYPE.LOADING_POSTS:
      return { ...state, loading: action.payload };

    case POST_TYPE.CREATE_POST:
      return { ...state, posts: [action.payload, ...state.posts] };

    case POST_TYPE.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        page: action.payload.page,
      };
    case POST_TYPE.UPDATE_POST:
      return {
        ...state,
        posts: EditData(state.posts, action.payload._id, action.payload),
      };

    case POST_TYPE.DELETE_POST:
      return {
        ...state,
        posts: DeleteData(state.posts, action.payload._id),
      };

    default:
      return state;
  }
};

export default postReducer;
