<template>
  <v-container>
    <v-card class="pb-3">
      <v-card-title class="primary white--text">Twitterに新規登録</v-card-title>
      <v-card-text class="pt-3">
        <v-form ref="form">
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="ユーザID"
          ></v-text-field>
          <v-text-field
            v-model="nickname"
            :rules="nicknameRules"
            label="ユーザ名"
          ></v-text-field>
          <v-text-field
            v-model="email"
            type="email"
            :rules="emailRules"
            label="メールアドレス"
          ></v-text-field>
          <v-text-field
            v-model="password"
            autocomplete
            :rules="passwordRules"
            type="password"
            label="パスワード"
          ></v-text-field>
          <v-text-field
            v-model="passwordConfirmation"
            autocomplete
            :rules="passwordConfirmationRules"
            type="password"
            label="パスワード(確認用)"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="accent"
          :loading="loading"
          class="mx-auto"
          v-on:click="register"
          >登録</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import mutation from "@/apollo/mutation.js";
import user from "@/apollo/models/user.js";
import { StringNonNullGQL } from "@/apollo/types.js";

export default {
  layout: "guest",
  data() {
    return {
      name: "",
      nameRules: [v => !!v || "ユーザIDを入力してください"],
      nickname: "",
      nicknameRules: [
        v => !!v || "ユーザ名を入力してください",
        v => v.length <= 255 || "ユーザ名を255文字以内で入力してください"
      ],
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
      password: "",
      passwordRules: [
        v => 6 <= v.length || "パスワードを6文字以上で入力してください"
      ],
      passwordConfirmation: ""
    };
  },
  computed: {
    passwordConfirmationRules() {
      return [
        v => !!v || "パスワード(確認用)を入力してください",
        v => v === this.password || "パスワードと一致しません"
      ];
    }
  },
  methods: {
    async register() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const registerUserGQL = user.register(
        "name",
        "nickname",
        "email",
        "password"
      );
      this.loading = true;
      const response = await this.$apollo.mutate({
        mutation: mutation(
          {
            name: StringNonNullGQL,
            nickname: StringNonNullGQL,
            email: StringNonNullGQL,
            password: StringNonNullGQL
          },
          registerUserGQL
        ),
        variables: {
          name: this.name,
          nickname: this.nickname,
          email: this.email,
          password: this.password
        }
      });
      this.loading = false;
      location.href = this.$routes.home.base;
    }
  }
};
</script>
