<template>
  <div id="app">
    <navbar />
    <router-view />
  </div>
</template>

<script>
  import Navbar from "@/components/navbar";
  import { onAuth } from "@bcwdev/auth0-vue";
  export default {
    name: "App",
    async beforeCreate() {
      this.$store.dispatch("getPublicKeeps");
      await onAuth();
      this.$store.dispatch("setBearer", this.$auth.bearer);
      this.$store.dispatch("getUserKeeps");
      this.$store.dispatch("getUserVaults");
    },
    components: {
      Navbar
    }
  };
</script>

<style lang="scss">
  @import "./assets/_variables.scss";
  @import "bootstrap";
  @import "./assets/_overrides.scss";
</style>