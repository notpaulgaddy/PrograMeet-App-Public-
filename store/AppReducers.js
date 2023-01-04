export default (state, { type, payload }) => {
  switch (type) {
    case "userLoggedIn":
      return { ...state, ...payload };
    case "allPosts":
      return { ...state, ...payload };
    case "Post":
      return { ...state, ...payload };
    case "Comment":
      return { ...state, ...payload };
    case "ActiveComment":
      return { ...state, ...payload };
    case "modal":
      return { ...state, ...payload };
    case "friendReqs":
      return { ...state, ...payload };
    case "recentMsgs":
      return { ...state, ...payload };
    case "notification":
      return { ...state, ...payload };
    case "FAB":
      return { ...state, ...payload };
    default:
      return state;
  }
};
