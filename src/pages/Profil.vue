<template>
    <v-ons-page>
        <div class="profile-header">
      <div class="profile-header-bg"></div>
      <v-ons-row>
        <v-ons-col width="100%">
          <h1 class="profile-name">{{ nama }}</h1>
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
  import axios from 'axios';
  import baseUrl from '../api.js';
  export default {
    data() {
      return {
        nama: "",
        nip: "",
        alamat: "",
      };
    },
    created() {
      this.getData();
    },
    methods: {
      async getData() {
        const token = localStorage.getItem('token');
        if (!token) return;
        const apiUrl = `${baseUrl}/pengguna`;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
          try {
            const response = await axios.get(apiUrl, config);
            this.nama = response.data[0].pegawai.name; // Memperbarui nilai data nama dengan nilai dari API
            this.alamat = response.data[0].pegawai.address;
            this.nip= response.data[0].pegawai.nip;// Memperbarui nilai data alamat dengan nilai dari API
          } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data', error);
          }
      },
      async logout() {
        const apiUrl = `${baseUrl}/logout`;
      try {
        const token = localStorage.getItem('token');
        const selectedMonth = localStorage.getItem('selectedMonth');
        const selectedYear = localStorage.getItem('selectedYear');
        
        await axios.post(apiUrl, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Melakukan logout, menghapus token API dan ID pengguna dari local storage
        localStorage.removeItem('token');
        localStorage.removeItem('selectedMonth');
        localStorage.removeItem('selectedYear');
        // Emit event ke eventBus untuk memberitahu komponen lain
        eventBus.$emit('logout', true);
      } catch (error) {
        console.error('Terjadi kesalahan saat logout', error);
      }
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
  