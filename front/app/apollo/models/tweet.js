import { makeGQL } from "@/apollo/utils.js";

const tweet = {
  findOne(args, ...params) {
    return makeGQL("tweet", args, params);
  },
  store(args, ...params) {
    return makeGQL("storeTweet", args, params);
  }
};

export default tweet;
