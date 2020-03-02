import { makeGQL } from "@/apollo/utils.js";

const user = {
  current(...params) {
    return makeGQL("currentUser", null, params);
  },
  findOne(args, ...params) {
    return makeGQL("user", args, params);
  },
  login(email, password, ...params) {
    return makeGQL("login", { email, password }, params);
  },
  register(name, nickname, email, password, ...params) {
    return makeGQL(
      "register",
      {
        name,
        nickname,
        email,
        password
      },
      params
    );
  }
};

export default user;
