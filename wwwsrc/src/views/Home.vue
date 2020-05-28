<template>
  <div class="container-fluid">
    </br>
    <div class="card col-10">
      <h1 class="text-center">Create a Keep</h1>
      <form @submit.prevent="createKeep" class="form-inline" style="justify-content: space-evenly;" role="form">
        <div class="md-form">
          <input type="text" class="form-control" id="name" placeholder="Name" v-model="newKeep.name" required />
        </div>
        <div class="md-form">
          <input type="text" class="form-control" id="description" placeholder="Description"
            v-model="newKeep.description" required />
        </div>
        <div class="md-form">
          <input type="text" class="form-control" id="img" placeholder="image" v-model="newKeep.img" />
        </div>
        <div class="custom-control custom-checkbox">
          <input @click="newKeep.isPrivate = !newKeep.isPrivate" type="checkbox" class="custom-control-input"
            id="defaultChecked2" />
          <label class="custom-control-label" for="defaultChecked2">Make Private</label>
          <span v-if="!newKeep.isPrivate" class="bg-dark text-warning rounded p-1">
            Public Keeps cannot be deleted</span>
          <span v-else-if="newKeep.isPrivate" class="bg-dark text-success rounded p-1">
            Your keep will be kept private!</span>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
    </br>
    <div v-if="this.$auth.isAuthenticated" class="col-12 row">
      <keep v-for="keep in keeps" :key="keep.id" :keepData="keep" :keepToVault="true" />
    </div>
    <div v-else class="row">
      <keep v-for="keep in keeps" :key="keep.id" :keepData="keep" :keepToVault="false" />
    </div>
  </div>
</template>

<script>
  import Keep from "../components/Keep";
  import { onAuth } from "@bcwdev/auth0-vue";
  export default {
    name: "home",
    data() {
      return {
        newKeep: {
          name: "",
          description: "",
          img: "",
          isPrivate: false,
          views: 0,
          shares: 0,
          keeps: 0
        }
      };
    },
    beforeCreate() {
      this.$store.dispatch("getPublicKeeps");
    },
    mounted() {
      this.$store.dispatch("getKeeps");
      this.$store.dispatch("getVaults");
      if (this.$auth.isAuthenticated) {
        this.$store.dispatch("getUserVaults");
      }
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      keeps() {
        return this.$store.state.publicKeeps;
      }
    },
    methods: {
      logout() {
        this.$store.dispatch("logout");
      },
      createKeep() {
        this.$store.dispatch("createKeep", this.newKeep);
        this.newKeep = {
          name: "",
          description: "",
          img: "",
          isPrivate: false,
          views: 0,
          shares: 0,
          keeps: 0
        };
      }
    },
    components: { Keep }
  };
</script>