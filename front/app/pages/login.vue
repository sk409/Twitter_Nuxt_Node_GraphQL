<template>
  <v-container>
    <v-card>
      <v-card-title class="primary white--text">Twitterにログイン</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="メールアドレス"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="パスワード"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="accent" class="mx-auto" @click="login">ログイン</v-btn>
      </v-card-actions>
    </v-card>
    <SnackbarView
      :message="notification"
      :visible.sync="snackbar"
    ></SnackbarView>
  </v-container>
</template>

<script>
import mutation from "@/apollo/mutation.js";
import SnackbarView from "@/components/SnackbarView.vue";
import user from "@/apollo/models/user.js";
import { StringNonNullGQL } from "@/apollo/types.js";

export default {
  layout: "guest",
  components: {
    SnackbarView
  },
  data() {
    return {
      email: "",
      emailRules: [
        v => !!v || "メールアドレスを入力してください",
        v => v.length <= 255 || "255文字以内で入力してください",
        v => {
          if (v.length === 0) {
            return "メールアドレスを入力してください";
          }
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || "メールアドレスの形式が正しくありません";
        }
      ],
      loading: false,
      notification: "",
      password: "",
      passwordRules: [
        v => 6 <= v.length || "パスワードを6文字以上で入力してください"
      ],
      snackbar: false
    };
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const data = {
        email: this.email,
        password: this.password
      };
      this.loading = true;
      const loginGQL = user.login("email", "password");
      const response = await this.$apollo.mutate({
        mutation: mutation(
          { email: StringNonNullGQL, password: StringNonNullGQL },
          loginGQL
        ),
        variables: {
          email: this.email,
          password: this.password
        }
      });
      this.loading = false;
      if (!response.data.login) {
        this.notification =
          "ログインに失敗しました。メールアドレスとパスワードを確認してください。";
        this.snackbar = true;
        return;
      }
      location.href = this.$routes.home.base;
    }
  }
};
</script>
