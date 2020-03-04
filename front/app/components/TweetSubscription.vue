<template>
  <div>
    <div v-for="tweet in tweets" :key="tweet.id">
      <TweetGroupTail :tweet="tweet" :user="user" @update:tweet="updateTweet"></TweetGroupTail>
      <v-divider></v-divider>
    </div>
    <div class="py-5 text-center">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<script>
import query from "@/apollo/query.js";
import TweetGroupTail from "@/components/TweetGroupTail.vue";
import user from "@/apollo/models/user.js";
import { IDNonNullGQL, IntNonNullGQL } from "@/apollo/types.js";

const fetchSize = 30;
const tweetParams = [
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
  },
  {
    conversation: {
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

export default {
  props: {
    fetchNew: {
      type: Boolean,
      default: false
    },
    user: {
      required: true,
      validator: v => typeof v === "object" || v === null
    }
  },
  components: {
    TweetGroupTail
  },
  apollo: {
    fetchNewTweets: {
      query: query(
        { id: IDNonNullGQL, limit: IntNonNullGQL, newAfter: IDNonNullGQL },
        user.findOne(
          { id: "id" },
          {
            subscription: {
              args: { limit: "limit", newAfter: "newAfter" },
              params: tweetParams
            }
          }
        )
      ),
      variables() {
        return {
          id: this.user.id,
          limit: fetchSize,
          newAfter: this.newAfter
        };
      },
      update(data) {
        this.newTweets = data.user.subscription;
      },
      skip() {
        return !this.user || this.newAfter < 0;
      }
    },
    fetchOldTweets: {
      query: query(
        { id: IDNonNullGQL, limit: IntNonNullGQL, oldBefore: IDNonNullGQL },
        user.findOne(
          { id: "id" },
          {
            subscription: {
              args: { limit: "limit", oldBefore: "oldBefore" },
              params: tweetParams
            }
          }
        )
      ),
      variables() {
        return {
          id: this.user.id,
          limit: fetchSize,
          oldBefore: this.oldBefore
        };
      },
      update(data) {
        this.oldTweets = data.user.subscription;
      },
      skip() {
        return !this.user;
      }
    }
  },
  data() {
    return {
      newAfter: -1,
      newTweets: [],
      oldBefore: -1,
      oldTweets: null,
      tweets: []
    };
  },
  created() {
    onscroll = this.scroll;
  },
  watch: {
    fetchNew() {
      if (this.tweets.length === 0) {
        return;
      }
      this.newAfter = this.tweets[0].id;
      this.$apollo.queries.fetchNewTweets.refetch();
    },
    newTweets() {
      const copy = [...this.newTweets];
      this.tweets = copy.reverse().concat(this.tweets);
      this.$emit("update:fetchNew", false);
    },
    oldTweets() {
      this.tweets = this.tweets.concat(this.oldTweets);
    }
  },
  methods: {
    scroll() {
      const scrollBottom =
        document.documentElement.scrollTop +
        document.documentElement.clientHeight;
      if (scrollBottom !== document.documentElement.scrollHeight) {
        return;
      }
      this.oldBefore = this.tweets[this.tweets.length - 1].id;
    },
    updateTweet(tweet) {
      const index = this.tweets.findIndex(t => t.id === tweet.id);
      this.$set(this.tweets, index, tweet);
    }
  }
};
</script>