const routes = {
  home: {
    base: "/home"
  },
  profile: {
    base: userId => `/${userId}`
  },
  tweets: {
    show(userId, tweetId) {
      return `/${userId}/status/${tweetId}`;
    }
  }
};

export default routes;
