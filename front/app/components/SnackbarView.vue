<template>
  <v-snackbar :value="visible" @input="input" :timeout="2000" top>
    <span>{{ message }}</span>
    <v-btn icon @click="close">
      <v-icon class="white--text">mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    input(visible) {
      this.$emit("update:visible", visible);
    }
  }
};
</script>
