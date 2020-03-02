import colors from "vuetify/es5/util/colors";

export default {
  server: {
    host: "0.0.0.0"
  },
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      {
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#fff"
  },
  /*
   ** Global CSS
   */
  css: ["@/assets/css/global.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/routes.js", "@/plugins/utils.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/apollo", "@nuxtjs/style-resources"],

  // Give apollo module options
  apollo: {
    clientConfigs: {
      default: "~/apollo/client-configs/default.js"
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: "#54a6db",
          accent: "#e91e63",
          secondary: "#03a9f4",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  styleResources: {
    sass: ["@/assets/sass/variable.scss"]
  },
  env: {
    serverOrigin: "http://localhost:7777"
  }
};
