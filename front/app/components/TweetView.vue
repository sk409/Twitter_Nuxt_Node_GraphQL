<template>
  <div v-if="tweet" class="body pl-4 pr-2">
    <div class="d-flex align-center">
      <span class="subtitle-1">{{ tweet.user.nickname }}</span>
      <span class="caption ml-1">@{{ tweet.user.name }}</span>
    </div>
    <pre class="body-1 tweet-text">
            {{ tweet.text }}
          </pre>
    <div class="d-flex justify-space-between my-2 tools">
      <div class="d-flex align-center">
        <v-btn icon x-small @click="dialogReply=true">
          <v-icon>mdi-comment-outline</v-icon>
        </v-btn>
        <span v-if="tweet.reply.length !== 0" class="ml-1">{{tweet.reply.length}}</span>
      </div>
      <v-btn icon x-small>
        <v-icon>mdi-twitter-retweet</v-icon>
      </v-btn>
      <div class="d-flex align-center">
        <v-btn icon x-small @click="clickFavorite">
          <v-icon :style="favoriteIconStyle" v-text="favoriteIconText"></v-icon>
        </v-btn>
        <span v-if="tweet.favorites.length !== 0" class="ml-1">{{tweet.favorites.length}}</span>
      </div>
      <v-btn icon x-small>
        <v-icon>mdi-upload-outline</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="dialogReply" width="60%">
      <ReplyForm :tweet="tweet" :user="user"></ReplyForm>
    </v-dialog>
  </div>
</template>

<script>
import favorite from "@/apollo/models/favorite.js";
import mutation from "@/apollo/mutation.js";
import ReplyForm from "@/components/ReplyForm.vue";
import { IDNonNullGQL } from "@/apollo/types.js";
export default {
  props: {
    tweet: {
      required: true,
      validator: v => typeof v === "object" || v === null
    },
    user: {
      required: true,
      validator: v => typeof v === "object" || v === null
    }
  },
  components: {
    ReplyForm
  },
  data() {
    return {
      dialogReply: false
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
  methods: {
    async clickFavorite() {
      if (this.likeThis) {
        const deleteFavoriteGQL = mutation(
          { tweetId: IDNonNullGQL, userId: IDNonNullGQL },
          favorite.delete({ tweetId: "tweetId", userId: "userId" }, "tweetId")
        );
        await this.$apollo.mutate({
          mutation: deleteFavoriteGQL,
          variables: {
            tweetId: this.tweet.id,
            userId: this.user.id
          }
        });
        const tweet = Object.assign({}, this.tweet);
        tweet.favorites = tweet.favorites.filter(
          favorite =>
            favorite.tweetId !== this.tweet.id &&
            favorite.userId !== this.user.id
        );
        this.$emit("update:tweet", tweet);
      } else {
        const storeFavoriteGQL = mutation(
          { tweetId: IDNonNullGQL, userId: IDNonNullGQL },
          favorite.store(
            { tweetId: "tweetId", userId: "userId" },
            "tweetId",
            "userId"
          )
        );
        const response = await this.$apollo.mutate({
          mutation: storeFavoriteGQL,
          variables: {
            tweetId: this.tweet.id,
            userId: this.user.id
          }
        });
        if (response.data.storeFavorite) {
          const tweet = Object.assign({}, this.tweet);
          tweet.favorites.push(response.data.storeFavorite);
          this.$emit("update:tweet", tweet);
        }
      }
    }
  }
};
</script>

<style>
.tools {
  width: 80%;
}
</style>
