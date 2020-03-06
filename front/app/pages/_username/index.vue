<template>
  <div v-if="user">
    <ScaffoldView>
      <template v-slot:center>
        <v-card>
          <v-card-title class="d-flex">
            <v-icon class="primary--text">mdi-arrow-left</v-icon>
            <div>
              <div></div>
              <div></div>
            </div>
          </v-card-title>
        </v-card>
      </template>
    </ScaffoldView>
  </div>
</template>

<script>
import ScaffoldView from "@/components/ScaffoldView.vue";
export default {
  layout: "auth",
  components: {
    ScaffoldView
  },
  data() {
    return {
      user: null
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      const userId = this.$route.params.userId;
    }
  }
};
</script>