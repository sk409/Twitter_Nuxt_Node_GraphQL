<template>
  <div>
    <div class="d-inline-block">
      <div
        v-for="menuItem in menuItems"
        :key="menuItem.id"
        :style="menuItemStyle(menuItem)"
        class="d-flex align-items menu-item pa-2 rounded"
        @click="$transition(menuItem.route)"
      >
        <v-icon v-if="menuItem.icon" class="icon" style="color:inherit;">
          {{ menuItem.icon }}
        </v-icon>
        <div v-else-if="user" class="icon">
          <v-img contain :src="$serverUrl(user.profileImagePath)"></v-img>
        </div>
        <span class="ml-3 title" style="font-weight:bold;">
          {{ menuItem.title }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      required: true,
      validator: v => typeof v === "object" || v === null
    }
  },
  computed: {
    menuItems() {
      if (!this.user) {
        return [];
      }
      return [
        {
          title: "ホーム",
          icon: "mdi-home-outline",
          route: this.$routes.home.base
        },
        {
          title: "話題を検索",
          icon: "mdi-pound"
        },
        {
          title: "通知",
          icon: "mdi-bell-outline"
        },
        {
          title: "メッセージ",
          icon: "mdi-email-outline"
        },
        {
          title: "ブックマーク",
          icon: "mdi-bookmark-outline"
        },
        {
          title: "リスト",
          icon: "mdi-file-document-outline"
        },
        {
          title: "プロフィール",
          route: this.$routes.profile.base(this.user.name)
        },
        {
          title: "もっと見る",
          icon: "mdi-dots-horizontal-circle-outline"
        }
      ];
    }
  },
  methods: {
    menuItemStyle(menuItem) {
      if (location.pathname === menuItem.route) {
        return {
          color: this.$nuxt.$vuetify.theme.currentTheme.primary
        };
      }
      return {};
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/sass/variables.scss";
.icon {
  width: 32px;
  height: 32px;
  color: inherit;
}
.menu-item:hover {
  background: rgba($primary, 0.1);
  color: $primary;
}
</style>
