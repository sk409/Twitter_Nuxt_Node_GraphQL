<template>
  <div>
    <TweetView
      :line="tweet.conversation.length !== 0"
      :tweet="tweet"
      :user="user"
      @created:reply="createdReply"
      @update:tweet="updateTweet"
    ></TweetView>
    <div v-if="tweet.conversation.length !== 0">
      <TweetView
        :line="2 <= tweet.conversationLength"
        :tweet="tweet.conversation[0]"
        :user="user"
        @created:reply="createdReply"
        @update:tweet="updateTweet"
      ></TweetView>
      <div v-if="2 <= tweet.conversationLength">
        <div
          v-if="!loading"
          @click="fetchMoreReplies"
          class="d-flex more-replies my-1"
        >
          <div class="dot-line-container">
            <div class="dot-line"></div>
          </div>
          <div class="link">他{{ tweet.conversationLength - 1 }}件の返信</div>
        </div>
        <div
          v-else-if="tweet.conversation.length !== tweet.conversationLength"
          class="text-center py-2"
        >
          <v-progress-circular
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-else>
          <TweetView
            v-for="(reply, index) in tweet.conversation.slice(1)"
            :key="reply.id"
            :line="index !== tweet.conversation.length - 2"
            :tweet="reply"
            :user="user"
            @created:reply="createdReply"
            @update:tweet="updateTweet"
          ></TweetView>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TweetView from "@/components/TweetView.vue";
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
    TweetView
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    createdReply(reply) {
      this.$emit("created:reply", reply);
    },
    fetchMoreReplies() {
      this.loading = true;
      this.$emit("fetch-more-replies", this.tweet);
    },
    updateTweet(tweet) {
      this.$emit("update:tweet", tweet);
    }
  }
};
</script>

<style>
.dot-line-container {
  width: 48px;
}

.dot-line {
  border: 1px dashed grey;
  margin: 0 auto;
  width: 1px;
  height: 100%;
}

.more-replies:hover {
  background: rgb(246, 248, 250);
}
</style>
