<template>
  <div v-if="user">
    <div ref="avatarAndTweetInput" class="d-flex">
      <div ref="avatarContainer">
        <v-avatar>
          <v-img :src="$serverUrl(user.profileImagePath)"></v-img>
        </v-avatar>
      </div>
      <div>
        <TweetInput ref="tweetInput" class="mt-2" :style="tweetInputStyle" @input="input"></TweetInput>
        <div class="d-flex align-center mt-5">
          <div class="d-flex justify-space-between">
            <v-btn icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <div class="d-flex align-center ml-auto pr-3">
            <v-progress-circular color="primary" :rotate="270" :size="20" :value="tweetProgress"></v-progress-circular>
            <span>｜</span>
            <span>○</span>
            <v-btn color="primary" rounded small @click="create">ツイートする</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mutation from "@/apollo/mutation.js";
import tweet from "@/apollo/models/tweet.js";
import TweetInput from "@/components/TweetInput.vue";
import { IDNonNullGQL, StringNonNullGQL } from "@/apollo/types.js";
export default {
  props: {
    user: {
      required: true,
      validator: v => typeof v === "object" || v === null
    }
  },
  components: {
    TweetInput
  },
  data() {
    return {
      tweetInputWidth: 0,
      tweetProgress: 0
    };
  },
  computed: {
    tweetInputStyle() {
      return {
        width: this.tweetInputWidth + "px"
      };
    }
  },
  watch: {
    user() {
      this.$nextTick(() => {
        this.tweetInputWidth =
          this.$refs.avatarAndTweetInput.clientWidth -
          this.$refs.avatarContainer.clientWidth;
      });
    }
  },
  methods: {
    async create() {
      const storeTweetGQL = tweet.store({
        text: "text",
        userId: "userId"
      });
      const response = await this.$apollo.mutate({
        mutation: mutation(
          { text: StringNonNullGQL, userId: IDNonNullGQL },
          storeTweetGQL
        ),
        variables: {
          text: this.$refs.tweetInput.$el.textContent,
          userId: this.user.id
        }
      });
    },
    input() {
      this.tweetProgress =
        (this.$refs.tweetInput.$el.textContent.length / 255) * 100;
    }
  }
};
</script>
