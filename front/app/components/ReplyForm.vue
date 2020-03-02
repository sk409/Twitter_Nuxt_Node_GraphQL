<template>
  <div v-if="tweet && user">
    <v-card>
      <div class="px-3 py-2">
        <v-btn color="primary" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <v-card-text>
        <div class="d-flex">
          <div class="d-flex flex-column">
            <div>
              <v-avatar>
                <v-img :src="$serverUrl(tweet.user.profileImagePath)"></v-img>
              </v-avatar>
            </div>
            <div class="flex-fill line mx-auto"></div>
          </div>
          <div class="ml-3">
            <div>
              <span class="title">{{tweet.user.nickname}}</span>
              <span class="caption">@{{tweet.user.name}}</span>
            </div>
            <pre class="tweet-text">{{tweet.text}}{{tweet.text}}</pre>
            <div class="my-3">
              <span class="link">@{{tweet.user.name}}</span>へ返信
            </div>
          </div>
        </div>
        <div class="d-flex">
          <div>
            <v-avatar>
              <v-img :src="$serverUrl(tweet.user.profileImagePath)"></v-img>
            </v-avatar>
          </div>
          <div class="flex-fill">
            <TweetInput></TweetInput>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import TweetInput from "@/components/TweetInput.vue";
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
    TweetInput
  }
};
</script>

<style>
.line {
  width: 2px;
  background: lightgray;
}
</style>