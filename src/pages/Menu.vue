<template>
  <v-ons-page modifier="white">
    <div class="profile-pic">
      <img src="../assets/Logo-Kabupaten-Bojonegoro.png">
    </div>

    <v-ons-list-title>Access</v-ons-list-title>
    <v-ons-list>
      <v-ons-list-item v-for="(item, index) in access" :key="item.title"
        :modifier="md ? 'nodivider' : ''"
        @click="loadView(index)"
      >
        <div class="left">
          <v-ons-icon fixed-width class="list-item__icon" :icon="item.icon"></v-ons-icon>
        </div>
        <div class="center">
          {{ item.title }}
        </div>
        <div class="right">
          <v-ons-icon icon="fa-link"></v-ons-icon>
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <v-ons-list-title>Logout</v-ons-list-title>
    <v-ons-list>
      <v-ons-list-item @click="logout" modifier="nodivider">
        <div class="left">
          <v-ons-icon fixed-width class="list-item__icon" icon="ion-log-out-outline"></v-ons-icon>
        </div>
        <div class="center">
          Logout
        </div>
        <div class="right">
          <v-ons-icon icon="fa-arrow-right"></v-ons-icon>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import eventBus from '../eventBus';
export default {
  methods: {
    loadView(index) {
      this.$store.commit('tabbar/set', index + 1);
      this.$store.commit('splitter/toggle');
    },
    async logout() {
      try {
        const token = localStorage.getItem('token');
        
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Melakukan logout, menghapus token API dan ID pengguna dari local storage
        localStorage.removeItem('token');
        // Emit event ke eventBus untuk memberitahu komponen lain
        eventBus.$emit('logout', true);
      } catch (error) {
        console.error('Terjadi kesalahan saat logout', error);
      }
    }
  },
  data() {
    return {
      access: [
        {
          title: 'Home',
          icon: 'ion-home, material:md-home'
        },
        {
          title: 'History',
          icon: 'ion-film-marker, material: md-movie-alt'
        },
      ]
    };
  }
};
</script>

<style scoped>
.profile-pic {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #DDD;
  color: rgba(0, 0, 0, .56);
  padding-bottom: 8px;
}
.page--material .profile-pic {
  background-color: #f6f6f6;
}

.profile-pic > img {
  display: block;
  max-width: 100%;
}
</style>

<style>
.page--material__background.page--white__background {
  background-color: #fff;
}
</style>
