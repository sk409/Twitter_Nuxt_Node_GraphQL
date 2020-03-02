<template>
  <div ref="tweetInput" contenteditable class="outline-none" @input="input"></div>
</template>

<script>
export default {
  methods: {
    input(e) {
      this.$emit("input", e);
    }
  }
};
</script>
