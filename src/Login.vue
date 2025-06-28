<template>
  <v-ons-page>
    <div v-if="isLoading" class="progress-container">
    <v-ons-progress-circular indeterminate></v-ons-progress-circular>
  </div>
    <div class="login-container">
      <div class="login-logo">
        <img src="./assets/Logo-Kabupaten-Bojonegoro.png" alt="Logo">
      </div>

      <div class="login-form">
        <v-ons-list>
          <v-ons-list-item>
            <div class="login-input">
              <v-ons-icon icon="md-account" class="login-icon"></v-ons-icon>
              <v-ons-input  v-model="email" modifier="underbar" placeholder="Email" float></v-ons-input>
            </div>
          </v-ons-list-item>
          
          <v-ons-list-item>
            <div class="login-input">
              <v-ons-icon icon="md-lock" class="login-icon"></v-ons-icon>
              <v-ons-input  v-model="password" modifier="underbar" :type="passwordFieldType" placeholder="Password" float></v-ons-input>
              <v-ons-icon icon="md-eye" class="password-toggle" @click="togglePasswordVisibility"></v-ons-icon>
            </div>
          </v-ons-list-item>
        </v-ons-list>

        <div class="login-button">
          <v-ons-button modifier="large" @click="login">Login</v-ons-button>
        </div>
      </div>
    </div>
    <v-ons-toast :visible.sync="toastVisible" animation="ascend">
      Email Atau Password salah
      <button @click="toastVisible = false">ok</button>
    </v-ons-toast>

 <!-- PWA Install Dialog -->
    <v-ons-dialog :visible.sync="showPwaDialog">
      <div style="padding: 20px; text-align: center;">
        <p>Install aplikasi ini di perangkat Anda untuk pengalaman yang lebih baik.</p>
        <v-ons-button @click="installPwa">Install</v-ons-button>
        <v-ons-button modifier="quiet" @click="showPwaDialog = false">Nanti saja</v-ons-button>
      </div>
    </v-ons-dialog>
  </v-ons-page>
</template>

<script>
import eventBus from './eventBus';
import axios from 'axios';
import baseUrl from './api.js';

export default {
  data() {
    return {
      email: '',
      password: '',
      passwordFieldType: 'password',
      isLoading: false,
      toastVisible: false,
      deferredPrompt: null,
      showPwaDialog: false,
    };
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
  },
  beforeDestroy() {
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
  },
  methods: {
    async login() {
          try {
            this.isLoading = true;
            const apiUrl = `${baseUrl}/login`;
            const response = await axios.post(apiUrl, {
              email: this.email,
              password: this.password
            });
            const token = response.data.token;
            if (token) {
              // Login berhasil, simpan token API di local storage atau cookie
              localStorage.setItem('token', token);
              // Redirect ke halaman beranda atau halaman lain yang sesuai
              eventBus.$emit('loginSuccess', true);
            } else {
              console.log('Gagal login');
            }
          } catch (error) {
            this.toastVisible=true;
          }finally {
            this.isLoading = false;
          }
        },
        togglePasswordVisibility() {
          this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },
    handleBeforeInstallPrompt(e) {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showPwaDialog = true;
    },
    async installPwa() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          this.showPwaDialog = false;
        }
        this.deferredPrompt = null;
      }
    }
      }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600px;
  z-index: -1;
}

.login-logo {
  margin-bottom: 30px;
}

.login-logo img {
  width: 250px;
  height: auto;
}

.login-form {
  width: 90%;
  max-width: 300px;
  border-radius: 10px;
}

ons-list{
  border-radius: 10px;
  padding: 10px;
}

.login-input {
  position: relative;
  margin-bottom: 15px;
  left: 20px;
  top: 5px;
}

.login-icon {
  position: relative;
  top: 6px;
  right: 15px;
  color: #999;
}
.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
}

.login-button {
  text-align: center;
  margin-top: 30px;
}
.progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
