<template>
  <ScaffoldView v-if="tweet && user">
    <template v-slot:center>
      <v-card flat outlined class="w-100">
        <v-card-title>
          <v-btn icon @click="$router.go(-1)">
            <v-icon class="primary--text">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="ml-2">スレッド</span>
        </v-card-title>
        <v-divider></v-divider>
        <div class="px-3 pt-3">
          <div class="d-flex">
            <v-avatar size="64">
              <v-img :src="$serverUrl(tweet.user.profileImagePath)"></v-img>
            </v-avatar>
            <div class="ml-2">
              <div class="title">{{ tweet.user.nickname }}</div>
              <div class="caption">{{ tweet.user.name }}</div>
            </div>
          </div>
          <TweetText class="tweet-text" :text="tweet.text"></TweetText>
          <v-divider class="mt-2"></v-divider>
          <div class="my-2">
            <span class="subtitle-1">{{ tweet.favorites.length }}</span>
            <span>いいねの数</span>
          </div>
          <v-divider></v-divider>
          <div class="d-flex justify-space-between my-1 px-5">
            <v-btn icon @click.stop>
              <v-icon>mdi-comment-outline</v-icon>
            </v-btn>
            <v-btn icon @click.stop>
              <v-icon>mdi-twitter-retweet</v-icon>
            </v-btn>
            <v-btn icon @click.stop>
              <v-icon
                :style="favoriteIconStyle"
                v-text="favoriteIconText"
              ></v-icon>
            </v-btn>
            <v-btn icon @click.stop>
              <v-icon>mdi-upload-outline</v-icon>
            </v-btn>
          </div>
          <v-divider></v-divider>
        </div>
        <TweetGroupHead
          v-for="reply in tweet.replies"
          :key="reply.id"
          :tweet="reply"
          :user="user"
          @fetch-more-replies="fetchMoreReplies"
        ></TweetGroupHead>
      </v-card>
    </template>
  </ScaffoldView>
</template>

<script>
import query from "@/apollo/query.js";
import ScaffoldView from "@/components/ScaffoldView.vue";
import tweet from "@/apollo/models/tweet.js";
import TweetGroupHead from "@/components/TweetGroupHead.vue";
import TweetText from "@/components/TweetText.vue";
import user from "@/apollo/models/user.js";
import { IDNonNullGQL, IntNonNullGQL } from "@/apollo/types.js";

const replyParams = conversationArgs => {
  return [
    "id",
    "text",
    "conversationLength",
    {
      user: {
        params: ["id", "name", "nickname", "profileImagePath"]
      }
    },
    {
      favorites: {
        params: ["userId"]
      }
    },
    {
      replies: {
        params: ["id"]
      }
    },
    {
      conversation: {
        args: conversationArgs,
        params: [
          "id",
          "text",
          {
            user: {
              params: ["id", "name", "nickname", "profileImagePath"]
            }
          },
          {
            favorites: {
              params: ["userId"]
            }
          },
          {
            replies: {
              params: ["id"]
            }
          }
        ]
      }
    }
  ];
};

export default {
  layout: "auth",
  components: {
    ScaffoldView,
    TweetGroupHead,
    TweetText
  },
  apollo: {
    currentUser: {
      query: query(null, user.current("id")),
      update(data) {
        this.dataCurrentUser = data.currentUser;
      }
    },
    tweet: {
      query: query(
        { id: IDNonNullGQL, depth: IntNonNullGQL },
        tweet.findOne(
          { id: "id" },
          "text",
          {
            user: {
              params: ["name", "nickname", "profileImagePath"]
            }
          },
          {
            favorites: {
              params: ["userId"]
            }
          },
          {
            replies: {
              params: replyParams({ depth: "depth" })
            }
          }
        )
      ),
      variables() {
        return {
          id: 2029,
          depth: 1
        };
      },
      update(data) {
        this.dataTweet = data.tweet;
      }
    },
    moreReplies: {
      query: query(
        { id: IDNonNullGQL },
        tweet.findOne({ id: "id" }, ...replyParams())
      ),
      variables() {
        return {
          id: this.moreRepliesTweetId
        };
      },
      update(data) {
        this.dataMoreReplies = data.tweet;
      },
      skip() {
        return !this.moreRepliesTweetId;
      }
    }
  },
  data() {
    return {
      dataMoreReplies: null,
      dataTweet: null,
      dataCurrentUser: null,
      moreRepliesTweetId: null,
      tweet: null,
      user: null
    };
  },
  computed: {
    favoriteIconStyle() {
      return this.likeThis ? { color: "rgb(206, 58, 96)" } : {};
    },
    favoriteIconText() {
      return this.likeThis ? "mdi-heart" : "mdi-heart-outline";
    },
    likeThis() {
      if (!this.tweet || !this.user) {
        return false;
      }
      const likeThis = this.tweet.favorites.find(
        favorite => favorite.userId === this.user.id
      );
      return likeThis;
    }
  },
  watch: {
    dataMoreReplies() {
      const index = this.tweet.replies.findIndex(
        reply => reply.id === this.moreRepliesTweetId
      );
      this.$set(this.tweet.replies, index, this.dataMoreReplies);
    },
    dataTweet() {
      this.tweet = this.dataTweet;
    },
    dataCurrentUser() {
      this.user = this.dataCurrentUser;
    }
  },
  methods: {
    fetchMoreReplies(tweet) {
      this.moreRepliesTweetId = tweet.id;
    }
  }
};
</script>

<style>
.tweet-text {
  font-size: 22px;
  font-weight: 530;
}
</style>
