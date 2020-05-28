<template>
  <div class="card-deck col-12 col-md-3 pb-2">
    <div class="card">
      <img class="card-img-top rounded-top" :src="keepData.img" />
      <div class="card-body">
        <h4 @click="viewKeep(keepData)" class="card-title" data-toggle="modal" data-target="#keep-view">
          {{keepData.name}}</h4>
        <div class="modal fade" id="keep-view" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-header">
              <img class="card-img-top rounded-top" :src="keepData.img" />
              <h3 class="modal-title">{{keepData.name}}</h3>
              <p class="modal-text">{{keepData.description}}</p>
            </div>
          </div>
        </div>
        <p class="card-text">{{keepData.description}}</p>
        <button class="btn btn-danger btn-sm" v-if="$route.name == 'vault view'"
          @click="removeFromVault(keepData.vaultKeepId)">Remove from Vault</button>
        <div v-if="(keepData.userId == this.$auth.userInfo.sub) && keepData.isPrivate">
          <button @click="deleteKeep(keepData)" class="btn btn-sm btn-danger mt-1">Delete Keep</button>
        </div>
        <div class="bottom row pb-3">
          <div v-if="keepToVault" class="col-12 mb-1">
            <form @submit.prevent="createVaultKeep(keepData)" action>
              <div class="form-group">
                <select class="form-control" v-model="newVaultKeep.vaultId">
                  <option v-for="vault in userVaults" :key="vault.id" :value="vault.id">{{vault.name}}</option>
                </select>
                <button type="submit" class="border-0 float-right">
                  <i class="fas fa-times-circle" v-if="$auth.isAuthenticated"></i>
                </button>
              </div>
            </form>
          </div>
          <p class="card-text">
            <small class="text-muted"><i class="fas fa-eye"></i>{{ keepData.views }}
              <i class="far fa-user"></i>{{ keepData.keeps }}
              <i class="fas fa-share-alt"></i>{{ keepData.shares }}
            </small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Keep",
    props: ["keepToVault", "keepData", "index"],
    data() {
      return {
        newVaultKeep: {
          keepId: "",
          vaultId: ""
        }
      };
    },
    mounted() { },
    computed: {
      userVaults() {
        return this.$store.state.userVaults;
      }
    },
    methods: {
      deleteKeep(keepData) {
        this.$store.dispatch("deleteKeep", keepData);
      },
      createVaultKeep(keepData) {
        this.newVaultKeep.keepId = keepData.id;
        this.$store.dispatch("createVaultKeep", this.newVaultKeep);
        keepData.keeps++;
        this.$store.dispatch("updateKeepCounts", keepData);
      },
      viewKeep(keepData) {
        keepData.views++;
        this.$store.dispatch("updateKeepCounts", keepData);
      },
      removeFromVault(vaultKeepId) {
        this.$store.dispatch("deleteVaultKeep", vaultKeepId);
      }
    }
  };
</script>

<style></style>