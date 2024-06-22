export const EXPLORE_TYPES = {
  LOADING: "LOADING_EXPLORE",
  GET_POSTS: "GET_EXPLORE_POSTS",
  UPDATE_POST: "UPDATE_EXPLORE_POST",
};

const initialState = {
  loading: false,
  posts: [],
  result: 3,
  page: 2,
};

const exploreReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPLORE_TYPES.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case EXPLORE_TYPES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        page: 2,
      };
    case EXPLORE_TYPES.UPDATE_POST:
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        page: state.page + 1,
      };
    default:
      return state;
  }
};

export default exploreReducer;
