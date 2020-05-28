import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import router from "../router";

Vue.use(Vuex);

let baseUrl = location.host.includes("localhost")
  ? "https://localhost:5001/"
  : "/";

let api = Axios.create({
  baseURL: baseUrl + "api/",
  timeout: 100000,
  withCredentials: true
});

export default new Vuex.Store({
  state: {
    publicKeeps: [],
    userKeeps: [],
    activeKeeps: {},
    vaults: [],
    userVaults: [],
    activeUser: {},
    activeVault: {},
    vaultKeeps: []
  },
  mutations: {
    setActiveUser(state, user) {
      state.activeUser = user;
    },
    setKeeps(state, data) {
      state.publicKeeps = data;
    },
    setActiveKeeps(state, keep) {
      state.activeKeeps = {};
      state.activeKeeps = keep;
    },
    setPublicKeeps(state, keeps) {
      state.publicKeeps = keeps;
    },
    setUserKeeps(state, userKeeps) {
      state.userKeeps = userKeeps;
    },
    addKeep(state, keep) {
      state.userKeeps.push(keep)
      if (!keep.isPrivate) {
        state.publicKeeps.push(keep)
      }
    },
    removeKeep(state, keepId) {
      state.publicKeeps = state.publicKeeps.filter(k => k.id != keepId);
      state.userKeeps = state.userKeeps.filter(k => k.id != keepId);
    },
    setVaults(state, vaults) {
      state.vaults = vaults;
    },
    setActiveVault(state, vault) {
      state.activeVault = {};
      state.activeVault = vault;
    },
    setUserVaults(state, userVaults) {
      state.userVaults = userVaults
    },
    addVault(state, vault) {
      state.userVaults.push(vault)
    },
    removeVault(state, vaultId) {
      state.userVaults = state.userVaults.filter(v => v.id != vaultId)
    },
    setVaultKeeps(state, vaultKeeps) {
      state.vaultKeeps = vaultKeeps
    },
    addVaultKeep(state, vaultKeep) {
      state.vaultKeeps.push(vaultKeep)
    },
    removeVaultKeep(state, vaultKeepId) {
      state.vaultKeeps = state.vaultKeeps.filter(vk => vk.vaultKeepId != vaultKeepId)
    },
    resetState(state) {
      (state.publicKeeps = []),
        (state.userKeeps = []),
        (state.activeKeeps = {}),
        (state.vaults = []),
        (state.vaultKeeps = []),
        (state.activeUser = {}),
        (state.activeVault = {}),
        (state.vaultKeeps = []);
    },
  },
  actions: {
    setBearer({ }, bearer) {
      api.defaults.headers.authorization = bearer;
    },
    resetBearer() {
      api.defaults.headers.authorization = "";
    },

    //#region --KEEPS--
    async getKeeps({ commit, dispatch }) {
      try {
        let res = await api.get("keeps");
        commit("setKeeps", res.data);
      } catch (error) {
        console.error(error)
      }
    },

    async createKeep({ commit, dispatch }, keepData) {
      try {
        let res = await api.post("keeps", keepData);
        commit("addKeep", res.data);
      } catch (error) {
        console.error(error)
      }
    },

    async getPublicKeeps({ commit, dispatch }) {
      try {
        let res = await api.get("keeps");
        commit("setPublicKeeps", res.data);
      } catch (error) {
        console.error(error)
      }
    },

    async getUserKeeps({ commit, dispatch }) {
      try {
        let res = await api.get("keeps/mykeeps");
        commit("setUserKeeps", res.data);
      } catch (error) {
        console.error(error)
      }
    },

    async deleteKeep({ commit, dispatch }, keepId) {
      try {
        let res = await api.delete(`keeps/${keepId}`, keepId);
        dispatch("getKeeps");
      } catch (error) {
        console.error(error)
      }
    },

    async editKeep({ commit, dispatch }, keepData) {
      try {
        let res = await api.put("keeps/" + keepData.id, keepData);
        dispatch("getKeeps");
      } catch (error) {
        console.error(error)
      }
    },

    async updateKeepCounts({ commit, dispatch }, keepData) {
      try {
        let res = await api.put(`keeps/${keepData.id}/counts`, keepData);
      } catch (error) {
        console.error(error)
      }
    },
    //#endregion

    //#region --VAULTS--
    async getVaults({ commit, dispatch }) {
      try {
        let res = await api.get("vaults");
        commit("setVaults", res.data);
      } catch (error) {
        console.error(error)
      }
    },

    async createVault({ commit, dispatch }, vaultData) {
      try {
        let res = await api.post("vaults", vaultData);
        commit("addVault", res.data);
      } catch (error) {
        console.error(error)
      }
    },

    async getUserVaults({ commit }) {
      try {
        let res = await api.get("vaults");
        commit("setUserVaults", res.data);
      } catch (error) {
        console.error(error)
      }
    },
    async deleteVault({ commit }, vaultId) {
      try {
        let res = await api.delete(`vaults/${vaultId}`)
        commit("removeVault", vaultId);
      } catch (error) {
        console.error(error)
      }
    },

    async setActiveVault({ commit }, vaultId) {
      try {
        let res = await api.get(`vaults/${vaultId}`)
        commit("setActiveVault", res.data);
      } catch (error) {
        console.error(error)
      }
    },
    //#endregion

    //#region --VAULTKEEPS--
    async getKeepsByVaultId({ commit }, vaultId) {
      try {
        let res = await api.get(`vaults/${vaultId}/keeps`)
        commit("setVaultKeeps", res.data);
      } catch (error) {
        console.error(error)
      }
    },

    async createVaultKeep({ commit }, vaultKeep) {
      try {
        let res = await api.post("vaultkeeps", vaultKeep)
        commit("addVaultKeep", res.data);
      } catch (error) {
        console.error(error)
      }
    },

    async addVaultKeep({ commit, dispatch }, data) {
      try {
        let res = await api.post("vaultkeeps", data);
        dispatch("getKeepsByVaultId", res.data.vaultId);
      } catch (error) {
        console.error(error)
      }
    },

    async deleteVaultKeep({ commit }, vaultKeepId) {
      try {
        let res = await api.delete(`vaultkeeps/${vaultKeepId}`)
        commit("removeVaultKeep", vaultKeepId);
      } catch (error) {
        console.error(error)
      }
    }
    //#endregion
  }
});
