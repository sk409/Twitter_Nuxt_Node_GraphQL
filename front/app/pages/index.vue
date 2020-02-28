<template>
  <div v-if="user">
    {{ user }}
  </div>
</template>

<script>
import user from "@/apollo/queries/user.js";
export default {
  data: () => ({
    user: null
  }),
  apollo: {
    user: {
      query: user.findById(2, "id", "email", { tweets: ["text"] }),
      update(data) {
        return data.userById;
      }
    }
  }
};
</script>
