<template>
    <v-ons-page>
        <div class="profile-header">
      <div class="profile-header-bg"></div>
      <v-ons-row>
        <v-ons-col width="100%">
          <h1 class="profile-name">Nama Anda</h1>
        </v-ons-col>
      </v-ons-row>
      <v-ons-row>
        <v-ons-col>
          <img class="profile-picture" src="../assets/Logo-Kabupaten-Bojonegoro.png" alt="Foto Profil">
        </v-ons-col>
      </v-ons-row>
    </div>
  
      <v-ons-row class="profile-info">
        <v-ons-col>
          <v-ons-icon class="icon" icon="fa-user"></v-ons-icon>
          <span class="info-value">{{ nama }}</span>
        </v-ons-col>
      </v-ons-row>
      <div class="divider"></div>
  
      <v-ons-row class="profile-info">
        <v-ons-col>
          <v-ons-icon class="icon" icon="fa-id-card"></v-ons-icon>
          <span class="info-value">{{ nip }}</span>
        </v-ons-col>
      </v-ons-row>
      <div class="divider"></div>
  
      <v-ons-row class="profile-info">
        <v-ons-col>
          <v-ons-icon class="icon" icon="fa-map-marker"></v-ons-icon>
          <span class="info-value">{{ alamat }}</span>
        </v-ons-col>
      </v-ons-row>
      <div class="divider"></div>
  
      <v-ons-row class="logout">
        <v-ons-col>
          <v-ons-button @click="logout" class="logout-button" modifier="cta" style="margin: 6px 0">Logout</v-ons-button>
        </v-ons-col>
      </v-ons-row>
    </v-ons-page>
  </template>
   
  <script>
  import eventBus from '../eventBus';
  export default {
    data() {
      return {
        nama: "John Doe",
        nip: "1234567890",
        alamat: "Jl. Contoh Alamat, Kota, Negara",
      };
    },
    methods: {
    logout() {
      eventBus.$emit('logout', true);
    }
    },
  };
  </script>
  
  <style scoped>
  .profile-header {
  position: relative;
  overflow: hidden;
}

.profile-header-bg {
 position: absolute;
  top: -70px;
  left: -85px;
  width: 150%;
  height: 100%;
  background: linear-gradient(to bottom right, #088395, #05BFDB);
  border-radius: 0 0 70% 70%;
  z-index: -1;
}
  .profile-name {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    margin-top: 20px;
    text-align: center;
  }
  
  .profile-picture {
    width: 150px;
    height: 150px;
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    margin: 20px auto;
    display: block;
  }
  
  .profile-info {
    margin: 20px 0;
    padding: 5px;
  }
  
  .info-label {
    margin-right: 5px;
  }
  
  .logout{
    text-align: center;
    margin-top: 30px;
  }

  .logout-button{
    width: 200px;
    background-color: #05BFDB;
  }
  
  .icon{
    width: 15%;
    padding-left: 10%;
  }
  .divider {
  height: 1px;
  background-color: #ccc;
  margin: 10px 0;
}
  </style>
  