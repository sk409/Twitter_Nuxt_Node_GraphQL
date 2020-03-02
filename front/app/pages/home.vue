<template>
  <v-container class="p-relative">
    <div class="menu">
      <HomeMenu :user="user"></HomeMenu>
    </div>
    <div class="main">
      <v-card flat outlined class="w-100">
        <v-card-title>ホーム</v-card-title>
        <v-divider></v-divider>
        <TweetForm :user="user"></TweetForm>
        <div class="divider mt-2"></div>
        <TweetSubscription :user="user"></TweetSubscription>
      </v-card>
    </div>
    <div class="information"></div>
  </v-container>
</template>

<script>
import HomeMenu from "@/components/HomeMenu.vue";
import query from "@/apollo/query.js";
import TweetForm from "@/components/TweetForm.vue";
import TweetSubscription from "@/components/TweetSubscription.vue";
import user from "@/apollo/models/user.js";
export default {
  layout: "auth",
  components: {
    HomeMenu,
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
      user: null
    };
  },
  created() {},
  methods: {}
};
</script>

<style>
.divider {
  height: 8px;
  background: rgba(32, 32, 32, 0.1);
}
.information {
  width: 30%;
}
.main {
  width: 50%;
  position: absolute;
  top: 0;
  left: 240px;
}
.menu {
  width: 240px;
  position: fixed;
  top: 0;
}
</style>
