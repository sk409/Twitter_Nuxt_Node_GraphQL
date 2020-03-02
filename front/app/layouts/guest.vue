<template>
  <v-app light>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  created() {
    console.log("GUEST");
  }
};
</script>
