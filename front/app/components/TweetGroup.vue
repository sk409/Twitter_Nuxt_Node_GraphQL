<template>
  <div>
    <TweetView
      :line="tweet.conversation.length!==0"
      :tweet="tweet"
      :user="user"
      @update:tweet="updateTweet"
    ></TweetView>
    <div v-if="tweet.conversation.length!==0">
      <div v-if="tweet.conversation.length<=2">
        <TweetView
          v-for="reply in tweet.conversation"
          :key="reply.id"
          :tweet="reply"
          :user="user"
          @update:tweet="updateTweet"
        ></TweetView>
      </div>
      <div v-else>
        <div class="d-flex my-1">
          <div class="dot-line-container">
            <div class="dot-line"></div>
          </div>
          <div class="link">返信をさらに表示</div>
        </div>
        <TweetView
          :line="true"
          :tweet="tweet.conversation[tweet.conversation.length-2]"
          :user="user"
          @update:tweet="updateTweet"
        ></TweetView>
        <TweetView
          :tweet="tweet.conversation[tweet.conversation.length-1]"
          :user="user"
          @update:tweet="updateTweet"
        ></TweetView>
      </div>
    </div>
  </div>
</template>


<script>
import TweetView from "@/components/TweetView.vue";
const strategyHead = "strategyHead";
const strategyTail = "strategyTail";
export default {
  props: {
    strategy: {
      type: String,
      default: strategyHead
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
    TweetView
  },
  computed: {
    isStrategyHead() {
      return this.strategy === strategyHead;
    },
    isStrategyTail() {
      return this.strategy === strategyTail;
    }
  },
  methods: {
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
</style>