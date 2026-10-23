
export const SET_MOVIES = "SET_MOVIES";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export const setMovies = (movies) => ({
  type: SET_MOVIES,
  payload: movies
});

export const setLoading = (value) => ({
  type: SET_LOADING,
  payload: value
});

export const setError = (message) => ({
  type: SET_ERROR,
  payload: message
});
