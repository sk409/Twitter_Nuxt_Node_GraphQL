const routes = {
  home: {
    base: "/home"
  },
  tweets: {
    show(userId, tweetId) {
      return `${userId}/status/${tweetId}`;
    }
  }
};

export default routes;
