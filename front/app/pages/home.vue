<template>
  <ScaffoldView>
    <template v-slot:center>
      <v-card flat outlined class="w-100">
        <v-card-title>ホーム</v-card-title>
        <v-divider></v-divider>
        <TweetForm :user="user" @created="fetchNew=true"></TweetForm>
        <div class="divider mt-2"></div>
        <TweetSubscription :fetch-new.sync="fetchNew" :user="user"></TweetSubscription>
      </v-card>
    </template>
  </ScaffoldView>
</template>

<script>
import query from "@/apollo/query.js";
import ScaffoldView from "@/components/ScaffoldView.vue";
import TweetForm from "@/components/TweetForm.vue";
import TweetSubscription from "@/components/TweetSubscription.vue";
import user from "@/apollo/models/user.js";
export default {
  layout: "auth",
  components: {
    ScaffoldView,
    TweetForm,
    TweetSubscription
  },
  apollo: {
    fetch: {
      query: query(
        null,
        user.current("name", "id", "email", "profileImagePath")
      ),
      update(data) {
        this.user = data.currentUser;
      }
    }
  },
  data() {
    return {
      fetchNew: false,
      user: null
    };
  },
  methods: {}
};
</script>

<style>
.divider {
  height: 8px;
  background: rgba(32, 32, 32, 0.1);
}
</style>
