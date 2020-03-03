<template>
  <div
    ref="tweetInput"
    contenteditable
    class="outline-none"
    :data-placeholder="placeholder"
    :data-placeholder-active="placeholderActive"
    @input="input"
  ></div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      placeholderActive: true
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.tweetInput.style.width =
        this.$refs.tweetInput.parentNode.clientWidth + "px";
    });
  },
  watch: {
    value() {
      this.$refs.tweetInput.textContent = this.value;
    }
  },
  methods: {
    input(e) {
      this.placeholderActive = this.$refs.tweetInput.textContent.length === 0;
      this.$emit("input", this.$refs.tweetInput.textContent);
    }
  }
};
</script>

<style>
[data-placeholder-active="true"]::before {
  content: attr(data-placeholder);
  opacity: 0.5;
}
</style>