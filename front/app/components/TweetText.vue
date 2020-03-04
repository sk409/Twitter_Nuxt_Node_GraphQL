<template>
  <pre class="wrap-text">{{ text }}</pre>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ""
    }
  }
};
</script>