import { makeGQL } from "@/apollo/utils.js";

const favorite = {
  delete(args, ...params) {
    return makeGQL("deleteFavorite", args, params);
  },
  findOne(args, ...params) {
    return makeGQL("favorite", args, params);
  },
  findAll(args, ...params) {
    return makeGQL("favorites", args, params);
  },
  store(args, ...params) {
    return makeGQL("storeFavorite", args, params);
  }
};

export default favorite;
