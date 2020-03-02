<template>
  <div>
    <div v-for="tweet in tweets" :key="tweet.id">
      <div class="d-flex">
        <div class="header pl-1">
          <v-avatar>
            <v-img :src="$serverUrl(tweet.user.profileImagePath)"></v-img>
          </v-avatar>
        </div>
        <TweetView :tweet="tweet" :user="user" class="body pl-4 pr-2" @update:tweet="u"></TweetView>
      </div>
      <v-divider></v-divider>
    </div>
    <div class="py-5 text-center">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<script>
import query from "@/apollo/query.js";
import TweetView from "@/components/TweetView.vue";
import user from "@/apollo/models/user.js";
import { IDNonNullGQL, IntNonNullGQL } from "@/apollo/types.js";
export default {
  props: {
    user: {
      required: true,
      validator: v => typeof v === "object" || v === null
    }
  },
  components: {
    TweetView
  },
  apollo: {
    fetch: {
      query: query(
        { id: IDNonNullGQL, limit: IntNonNullGQL, oldBefore: IDNonNullGQL },
        user.findOne(
          { id: "id" },
          {
            subscription: {
              args: { limit: "limit", oldBefore: "oldBefore" },
              params: [
                "id",
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
                }
              ]
            }
          }
        )
      ),
      variables() {
        return {
          id: this.user.id,
          limit: 30,
          oldBefore: this.oldBefore
        };
      },
      update(data) {
        this.subscription = data.user.subscription;
      },
      skip() {
        return !this.user;
      }
    }
  },
  data() {
    return {
      oldBefore: -1,
      subscription: null,
      tweets: []
    };
  },
  created() {
    onscroll = this.scroll;
  },
  watch: {
    subscription(newSubscription) {
      this.tweets = this.tweets.concat(newSubscription);
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
    u(tweet) {
      const index = this.tweets.findIndex(t => t.id === tweet.id);
      this.$set(this.tweets, index, tweet);
    }
  }
};
</script>

<style>
.header {
  width: 10%;
}
.body {
  width: 90%;
}
</style>
