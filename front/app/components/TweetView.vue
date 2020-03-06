<template>
  <div
    v-if="tweet"
    class="d-flex tweet-view"
    @click="$router.push($routes.tweets.show(tweet.user.name, tweet.id))"
  >
    <div class="d-flex flex-column header pl-1">
      <v-avatar>
        <v-img :src="$serverUrl(tweet.user.profileImagePath)"></v-img>
      </v-avatar>
      <div v-if="line" class="flex-fill line mx-auto"></div>
    </div>
    <div class="body pl-4 pr-2">
      <div class="d-flex align-center">
        <span class="subtitle-1">{{ tweet.user.nickname }}</span>
        <span class="caption ml-1">@{{ tweet.user.name }}</span>
      </div>
      <TweetText :text="tweet.text"></TweetText>
      <div class="d-flex justify-space-between my-2 tools">
        <div class="d-flex align-center">
          <v-btn icon x-small @click.stop="dialogReply = true">
            <v-icon>mdi-comment-outline</v-icon>
          </v-btn>
          <span v-if="tweet.replies.length !== 0" class="ml-1">
            {{ tweet.replies.length }}
          </span>
        </div>
        <v-btn icon x-small @click.stop>
          <v-icon>mdi-twitter-retweet</v-icon>
        </v-btn>
        <div class="d-flex align-center">
          <v-btn icon x-small @click.stop="clickFavorite">
            <v-icon
              :style="favoriteIconStyle"
              v-text="favoriteIconText"
            ></v-icon>
          </v-btn>
          <span v-if="tweet.favorites.length !== 0" class="ml-1">
            {{ tweet.favorites.length }}
          </span>
        </div>
        <v-btn icon x-small @click.stop>
          <v-icon>mdi-upload-outline</v-icon>
        </v-btn>
      </div>
    </div>
    <v-dialog v-model="dialogReply" width="60%">
      <ReplyForm
        :tweet="tweet"
        :user="user"
        @cancel="dialogReply = false"
        @created="createdReply"
      ></ReplyForm>
    </v-dialog>
  </div>
</template>

<script>
import favorite from "@/apollo/models/favorite.js";
import mutation from "@/apollo/mutation.js";
import ReplyForm from "@/components/ReplyForm.vue";
import TweetText from "@/components/TweetText.vue";
import { IDNonNullGQL } from "@/apollo/types.js";
export default {
  props: {
    line: {
      type: Boolean,
      default: false
    },
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
    ReplyForm,
    TweetText
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
    },
    createdReply(reply) {
      this.dialogReply = false;
      this.$emit("created:reply", reply);
    }
  }
};
</script>

<style>
.body {
  width: 90%;
}

.header {
  width: 10%;
}

.line {
  background: lightgrey;
  width: 2px;
}

.tools {
  width: 80%;
}

.tweet-view:hover {
  background: rgb(246, 248, 250);
}
</style>
