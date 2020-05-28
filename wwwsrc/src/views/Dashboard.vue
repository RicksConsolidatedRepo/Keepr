<template>
  <div class="dashboard">
    <h1>WELCOME TO YOUR DASHBOARD</h1>
    </br>
    <div class="card-group justify-content-between">
      <div class="card col-4">
        <h2>Make a New Vault</h2>
        <form @submit.prevent="createVault">
          <div class="form-group">
            <input type="text" name="name" class="form-control" placeholder="Vault name" v-model="newVault.name" />
          </div>
          <div class="form-group">
            <input type="text" name="description" class="form-control" placeholder="Vault description"
              v-model="newVault.description" />
          </div>
          <button type="submit" class="btn btn-primary">Create Vault</button>
        </form>
      </div>
      <div class="card col-4 align-self-start">
        <h2>Select a Vault</h2>
        <select class="form-control" @change="setActiveVault($event)" v-if="$auth.isAuthenticated">
          <option value selected disabled>Select Vault</option>
          <option v-for="vault in userVaults" :value="vault.id" :key="vault.id">{{ vault.name }}
          </option>
        </select>
      </div>
      <div class="col-12">
        </br>
        <!-- <userVaults /> -->
      </div>
    </div>
    <h1>User Vaults</h1>
    <div class="row">
      <div class="col-3 my-1" v-for="vault in userVaults" :key="vault.id" :vaultData="vault">
        <div class="card">
          <router-link :to="{name: 'vault', params: {vaultId: vault.id}}">
            <h3 class="card-text">{{vault.name}}</h3>
          </router-link>
          <div class="card-body">
            <p class="card-text">{{vault.description}}</p>
            <button @click="deleteVault(vault.id)" class="btn btn-sm btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import { onAuth } from "@bcwdev/auth0-vue";
  import Keep from "../components/Keep";
  import Vault from "../views/Vault.vue";
  export default {
    name: "dashboard",
    async beforeCreate() {
      this.$store.dispatch("getPublicKeeps");
      await onAuth();
      this.$store.dispatch("setBearer", this.$auth.bearer);
      this.$store.dispatch("getUserKeeps");
      this.$store.dispatch("getUserVaults");
    },
    data() {
      return {
        newVault: {
          name: "",
          description: ""
        }
      };
    },
    mounted() { },
    methods: {
      setActiveVault(event) {
        this.activeVaultId =
          event.target.options[event.target.options.selectedIndex].value;
        this.$store.dispatch("setActiveVault", this.activeVaultId);
        this.$store.dispatch("getKeepsByVaultId", this.activeVaultId);
      },
      createVault() {
        this.$store.dispatch("createVault", this.newVault);
        this.newVault = {
          name: "",
          description: ""
        };
      },
      deleteVault(vaultId) {
        this.$store.dispatch("deleteVault", vaultId);
      }
    },
    computed: {
      publicKeeps() {
        return this.$store.state.publicKeeps;
      },
      userKeeps() {
        return this.$store.state.userKeeps;
      },
      userVaults() {
        return this.$store.state.userVaults;
      }
    },
    components: { Keep }
  };
</script>

<style></style>