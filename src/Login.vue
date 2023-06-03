<template>
  <v-ons-page>
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
  </v-ons-page>
</template>

<script>
import eventBus from './eventBus';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      passwordFieldType: 'password'
    };
  },
  methods: {
    async login() {
          try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
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
              // Gagal login, tampilkan pesan kesalahan atau lakukan tindakan lainnya
              console.log('Gagal login');
            }
          } catch (error) {
            console.error('Terjadi kesalahan saat login', error);
          }
        },
        togglePasswordVisibility() {
          this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
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
</style>
