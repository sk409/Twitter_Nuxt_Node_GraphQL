<template>
  <v-container class="p-relative">
    <div class="left">
      <MenuView :user="user"></MenuView>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right"></div>
  </v-container>
</template>

<script>
import MenuView from "@/components/MenuView.vue";
import query from "@/apollo/query.js";
import user from "@/apollo/models/user.js";
export default {
  components: {
    MenuView
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
  }
};
</script>

<style>
.left {
  width: 240px;
  position: fixed;
  top: 0;
}
.center {
  width: 50%;
  position: absolute;
  top: 0;
  left: 240px;
}
.right {
  width: 30%;
}
</style>