<template>
  <v-container>
    <v-img src="localhost7777"></v-img>
  </v-container>
</template>

<script>
import query from "@/apollo/query.js";
import mutation from "@/apollo/mutation.js";
import tweet from "@/apollo/models/tweet.js";
import user from "@/apollo/models/user.js";
import { StringNonNullGQL, IDNonNullGQL } from "@/apollo/types.js";

import gql from "graphql-tag";
export default {
  layout: "guest",
  // apollo: {
  //   fetch: {
  //     query: query({ $id: "ID!" }, tweet.findOne({ userId: "$id" }, "text")),
  //     variables: {
  //       id: 1
  //     },
  //     update(data) {
  //       this.current = data.currentUser;
  //       this.user = data.user;
  //       this.tweet = data.tweet;
  //     }
  //   }
  // },
  data: () => ({
    current: null,
    user: null,
    tweet: null,
    text: ""
  }),
  methods: {
    async register() {
      const storeTweetGQL = tweet.store(
        { text: "text", userId: "userId" },
        "text"
      );
      const response = await this.$apollo.mutate({
        mutation: mutation(
          { text: StringNonNullGQL, userId: IDNonNullGQL },
          storeTweetGQL
        ),
        variables: {
          text: this.text,
          userId: 1
        }
      });
      console.log(response);
    }
  }
};
</script>
