<template>
  <div v-if="user">
    <ScrollView @scroll:bottom="fetchOldTweets">
      <ScaffoldView>
        <template v-slot:center>
          <v-card>
            <v-card-title class="d-flex">
              <v-icon class="primary--text">mdi-arrow-left</v-icon>
              <div class="ml-4">
                <div class="bold">{{ user.nickname }}</div>
                <div></div>
              </div>
            </v-card-title>
            <div>
              <div class="d-flex">
                <v-btn color="primary" outlined rounded class="ml-auto mr-3"
                  >プロフィールを編集</v-btn
                >
              </div>
              <div class="px-2">
                <div class="bold username">{{ user.nickname }}</div>
                <div class="user-nickname">@{{ user.name }}</div>
                <div>
                  <v-btn text>32フォロー中</v-btn>
                  <v-btn text>34フォロワー</v-btn>
                </div>
              </div>
            </div>
            <v-tabs v-model="tab">
              <v-tab href="#tweets">ツイート</v-tab>
              <v-tab href="#replies">ツイートと返信</v-tab>
              <v-tab href="#media">メディア</v-tab>
              <v-tab href="#favorites">いいね</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item value="tweets">
                <div v-for="tweet in user.tweets" :key="tweet.id">
                  <TweetView :tweet="tweet" :user="user"></TweetView>
                  <v-divider></v-divider>
                </div>
                <div class="py-3 text-center">
                  <v-progress-circular
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </template>
      </ScaffoldView>
    </ScrollView>
  </div>
</template>

<script>
import query from "@/apollo/query.js";
import ScaffoldView from "@/components/ScaffoldView.vue";
import ScrollView from "@/components/ScrollView.vue";
import TweetView from "@/components/TweetView.vue";
import user from "@/apollo/models/user.js";
import {
  IDNonNullGQL,
  IntNonNullGQL,
  StringNonNullGQL
} from "@/apollo/types.js";

let fetchTweetSize = 30;

export default {
  layout: "auth",
  components: {
    ScaffoldView,
    ScrollView,
    TweetView
  },
  apollo: {
    dataNewTweets: {
      query: query(
        {
          name: StringNonNullGQL,
          newAfter: IDNonNullGQL,
          limit: IntNonNullGQL
        },
        user.findOne(
          { name: "name" },
          "id",
          "name",
          "nickname",
          "profileImagePath",
          {
            tweets: {
              args: {
                newAfter: "newAfter",
                limit: "limit"
              },
              params: [
                "id",
                "text",
                {
                  replies: {
                    params: ["id"]
                  }
                },
                {
                  favorites: {
                    params: ["userId"]
                  }
                },
                {
                  user: {
                    params: ["id", "name", "nickname", "profileImagePath"]
                  }
                }
              ]
            }
          }
        )
      ),
      variables() {
        return {
          name: this.$route.params.username,
          newAfter: this.newAfter,
          limit: fetchTweetSize
        };
      },
      update(data) {
        return data.user.tweets;
      },
      skip() {
        return 0 <= this.newAfter;
      }
    },
    dataOldTweets: {
      query: query(
        {
          name: StringNonNullGQL,
          oldBefore: IDNonNullGQL,
          limit: IntNonNullGQL
        },
        user.findOne(
          { name: "name" },
          "id",
          "name",
          "nickname",
          "profileImagePath",
          {
            tweets: {
              args: {
                oldBefore: "oldBefore",
                limit: "limit"
              },
              params: [
                "id",
                "text",
                {
                  replies: {
                    params: ["id"]
                  }
                },
                {
                  favorites: {
                    params: ["userId"]
                  }
                },
                {
                  user: {
                    params: ["id", "name", "nickname", "profileImagePath"]
                  }
                }
              ]
            }
          }
        )
      ),
      variables() {
        return {
          name: this.$route.params.username,
          oldBefore: this.oldBefore,
          limit: fetchTweetSize
        };
      },
      update(data) {
        return data.user.tweets;
      }
    },
    dataUser: {
      query: query(
        { name: StringNonNullGQL },
        user.findOne(
          { name: "name" },
          "id",
          "name",
          "nickname",
          "profileImagePath"
        )
      ),
      variables() {
        return {
          name: this.$route.params.username
        };
      },
      update(data) {
        return data.user;
      }
    }
  },
  data() {
    return {
      dataNewTweets: null,
      dataOldTweets: null,
      dataUser: null,
      newAfter: -1,
      oldBefore: -1,
      tab: "",
      user: null
    };
  },
  watch: {
    dataUser() {
      const copy = JSON.parse(JSON.stringify(this.dataUser));
      copy.tweets = [];
      this.user = copy;
    },
    dataNewTweets() {},
    dataOldTweets() {
      const copy = JSON.parse(JSON.stringify(this.dataOldTweets));
      this.user.tweets = this.user.tweets.concat(copy);
    }
  },
  methods: {
    fetchOldTweets() {
      this.oldBefore = this.user.tweets[this.user.tweets.length - 1].id;
    }
  }
};
</script>

<style>
.username {
  font-size: 20px;
}
.user-nickname {
  color: gray;
  font-size: 18px;
}
</style>
