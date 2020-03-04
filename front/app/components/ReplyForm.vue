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
            <pre class="tweet-text">{{tweet.text}}</pre>
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
            <TweetInput v-model="text" placeholder="返信をツイート"></TweetInput>
            <div class="d-flex">
              <v-btn color="primary" depressed rounded small class="ml-auto mr-2" @click="create">返信</v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import mutation from "@/apollo/mutation.js";
import tweet from "@/apollo/models/tweet.js";
import TweetInput from "@/components/TweetInput.vue";
import { IDNonNullGQL, StringNonNullGQL } from "@/apollo/types.js";
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
  },
  data() {
    return {
      text: ""
    };
  },
  methods: {
    async create() {
      const storeTweetGQL = mutation(
        {
          text: StringNonNullGQL,
          userId: IDNonNullGQL,
          parentId: IDNonNullGQL
        },
        tweet.store({ text: "text", userId: "userId", parentId: "parentId" })
      );
      const response = await this.$apollo.mutate({
        mutation: storeTweetGQL,
        variables: {
          text: this.text,
          userId: this.user.id,
          parentId: this.tweet.id
        }
      });
      console.log(response);
    }
  }
};
</script>

<style>
.line {
  width: 2px;
  background: lightgray;
}
</style>