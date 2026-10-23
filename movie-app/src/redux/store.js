
import { legacy_createStore as createStore } from "redux";
import movieReducer from "./reducer";

const store = createStore(movieReducer);

export default store;
