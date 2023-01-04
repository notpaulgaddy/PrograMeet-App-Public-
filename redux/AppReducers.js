import { combineReducers } from "redux";
const INITIAL_STATE = {
  user: null,
};
const usersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CURRENT_USER":
      const { user } = state;
      user = action.payload;

      const newUsr = { user };
      return newUsr;
    default:
      return state;
  }
};

export default combineReducers({
  users: usersReducer,
});
