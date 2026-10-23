
import {
  SET_MOVIES,
  SET_LOADING,
  SET_ERROR
} from "./action";

const initialState = {
  movies: [],
  loading: false,
  error: ""
};

function movieReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MOVIES:
      return {
        ...state,
        movies: action.payload
      };

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
}

export default movieReducer;
