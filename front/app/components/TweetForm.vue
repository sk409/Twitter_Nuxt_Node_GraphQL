<template>
  <div v-if="user">
    <div ref="avatarAndTweetInput" class="d-flex">
      <div ref="avatarContainer">
        <v-avatar>
          <v-img :src="$serverUrl(user.profileImagePath)"></v-img>
        </v-avatar>
      </div>
      <div class="flex-fill">
        <TweetInput v-model="text" class="mt-2"></TweetInput>
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
      text: "",
      tweetProgress: 0
    };
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
          text: this.text,
          userId: this.user.id
        }
      });
      this.text = "";
      this.$emit("created");
    }
  }
};
</script>
