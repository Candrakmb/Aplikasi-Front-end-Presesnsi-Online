<template>
    <v-ons-page>
      <install-prompt />
      <v-ons-progress-bar v-if="isLoading" indeterminate></v-ons-progress-bar>
      <div class="card-welcome">
        <div class="info-user">
          <p class="user-name">Hello, {{ nama }}</p>
          <p class="user-nip"> {{ nip }}</p>
        </div>
        <div class="profil">
          <img class="profile-picture" src="../assets/Logo-Kabupaten-Bojonegoro.png" alt="Foto Profil">
        </div>
      </div>
      <div class="status" >
        <p v-if="pageToday.length > 0" class="hari-ini">Today</p>
          <div class="card-wrapper">
          <v-ons-card class="card" v-for="page of pageToday" :key="page.taskDetailsId"  @click="push(page)">
            <div class="card-content">
              <div class="kalender">
                  <div class="card-description nama_bulan" >{{ page.bulan }}</div>
                  <div class="card-description nama_hari">{{ page.hari }}</div>
                  <div class="card-description tanggal">{{ page.tanggal }}</div>
                  <div class="card-description tahun">{{ page.tahun }}</div>
              </div>
              <div class="informasi">
                <div class="card-title">{{ page.keterangan }}</div>
                <div class="card-subtitle"><v-ons-icon icon="ion-map"></v-ons-icon>
                <span> {{ page.hanyaDesa }}, {{ page.kecamatan }}</span></div>
              </div>
            </div>
          </v-ons-card>
        </div>
      </div>
      <div class="status">
        <p v-if="pages.length > 0" class="hari-ini">Next Day</p>
          <div class="card-wrapper">
          <v-ons-card class="card" v-for="page of pages" :key="page.taskDetailsId"  @click="push(page)">
            <div class="card-content">
              <div class="kalender">
                  <div class="card-description nama_bulan" >{{ page.bulan }}</div>
                  <div class="card-description nama_hari">{{ page.hari }}</div>
                  <div class="card-description tanggal">{{ page.tanggal }}</div>
                  <div class="card-description tahun">{{ page.tahun }}</div>
              </div>
              <div class="informasi">
                <div class="card-title">{{ page.keterangan }}</div>
                <div class="card-subtitle"><v-ons-icon icon="ion-map"></v-ons-icon>
                <span> {{ page.hanyaDesa }}, {{ page.kecamatan }}</span></div>
              </div>
            </div>
          </v-ons-card>
        </div>
      </div>
      <div :hidden="!textKosong" class="kosong">
        <p class="text-kosong">Belum Ada Kegiatan</p>
      </div>
    </v-ons-page>
</template>

<script>
import Absensi from './absensi.vue';
import axios from 'axios';
import baseUrl from '../api.js';
import InstallPrompt from '../installprompt/InstallPrompt.vue';

export default {
  components: {
    InstallPrompt
  },
  data() {
    return {
      pageToday: [],
      pages: [],
      textKosong: false,
      isLoading: false,
      nama:'',
      nip:'',
    };
  },
  created() {
    this.getData();
    this.fetchData();
    if (localStorage.getItem('loggedIn') === 'true') {
      setInterval(() => {
      this.fetchData();
     }, 5000);
    }
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
            this.nip= response.data[0].pegawai.nip;// Memperbarui nilai data alamat dengan nilai dari API
          } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data', error);
          }
      },
    async fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const apiUrl = `${baseUrl}/tasks`;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(apiUrl, config);
        const tasks = response.data.tasks;
        const taskDetails = response.data.task_details;

          this.pageToday = [];
          this.pages = [];

        if (tasks.length > 0 && taskDetails.length > 0) {
          this.pageToday = [];
          this.pages = [];
          this.textKosong=false;
          this.isLoading = true;
          tasks.forEach((task) => {
            const matchingDetails = taskDetails.filter((detail) => detail.task_id === task.id);
            if (matchingDetails.length > 0) {
              matchingDetails.sort((a, b) => {
                const dateA = new Date(a.tgl_pelaksanaan);
                const dateB = new Date(b.tgl_pelaksanaan);
                return dateA - dateB;
              });

              matchingDetails.forEach((detail) => {
                const data = {
                  userId: task.user_id,
                  kegiatan: task.kegiatan,
                  taskDetailsId: detail.id,
                  kecamatan: detail.kecamatan,
                  desa: detail.desa,
                  tanggalPelaksanaan: detail.tgl_pelaksanaan,
                  keterangan:detail.keterangan,
                };

                // Mendapatkan tanggal dari string
                const date = new Date(data.tanggalPelaksanaan);
                const optionsmonth = { month: 'long' };
                const formattermonth = new Intl.DateTimeFormat('id-ID', optionsmonth);
                const month = formattermonth.format(date);
                const optionsday = { weekday: 'long' };
                const formatterday = new Intl.DateTimeFormat('id-ID', optionsday);
                const dayName = formatterday.format(date);
                const day = date.getDate();
                const year = date.getFullYear();

                // Menambahkan informasi tanggal ke objek data
                data.bulan = month;
                data.hari = dayName;
                data.tanggal = day;
                data.tahun = year;

                const desaSplit = data.desa.split("_"); // Ubah karakter pemisah sesuai kebutuhan Anda

                // Mengambil kata terakhir (misalnya, "desa" yang terpisah)
                const desa = desaSplit[desaSplit.length - 1];

                // Menyimpan kata "desa" yang terpisah kembali ke objek data
                data.hanyaDesa = desa;

                if (date.toDateString() === new Date().toDateString()) {
                this.pageToday.push(data);
                } else {
                  this.pages.push(data);
                }
              });
            }
          });
          this.isLoading = false;
        }
        if (this.pageToday.length === 0 && this.pages.length === 0) {
            
            this.textKosong=true;
          }
      } catch (error) {
        console.log(error);
      }
    },
    push(page) {
      this.$store.commit('navigator/push', {
        extends: Absensi,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'Home',
              title: 'Absensi'
            },
            user_id: page.userId,
            taskDetailsId: page.taskDetailsId,
            keterangan: page.keterangan,
            kecamatan: page.kecamatan,
            desa: page.desa,
            kegiatan: page.kegiatan,
            checkDate: page.tanggalPelaksanaan,
            bulan:page.bulan,
            hari: page.hari,
            tanggal: page.tanggal,
            tahun: page.tahun,
            hanyaDesa: page.hanyaDesa
          }
        }
      });
    }
  }
};
</script>

<style scoped>
*{
  font-family: 'Poppins', sans-serif;
}
.card-welcome{
  display: grid;
  grid-template-columns: auto 100px;
  width: 100%;
  height: auto;
  background: #fff;
}

.info-user{
  margin-left: 30px;
}

.info-user .user-name{
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: 700;
}

.info-user .user-nip{
  font-size: 12px;
  color: #999;
}

.profil{
  background: rgb(8, 131, 149) ;
}

.status{
  margin: 1px 0 1px 0;
  width:100%;
  height: auto;
}
.status .hari-ini{
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: 700;
}

.profil .profile-picture{
    width: 50px;
    height: 50px;
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    margin: 20px auto;
    display: block;
}
.card-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.card {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-content {
  padding: 2px;
  display: grid;
  grid-template-columns: auto auto;
}
.kalender {
  margin-right: 20px;
  position: relative;
  width: 100px;
  background: #fff;
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 4px rgba(0, 0, 0, 0.2);
}
.kalender .nama_bulan{
  position: relative;
  padding: 5px 10px;
  background: #05BFDB;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
}
.kalender .nama_hari{
  margin-top: 5px;
  font-size: 12px;
  font-weight: 300;
  color: #999;
}
.kalender .tanggal{
  margin-top: 0px;
  line-height: 1em;
  font-size: 30px;
  font-weight: 700;
  color:#333;
}
.kalender .tahun{
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 600;
  color:#999;
}
.informasi{
 justify-content: center;
}

.card-title {
  margin-top: 15px;
  font-weight: 800;
  font-size: 18px;
}

.card-subtitle {
  display: grid;
  grid-template-columns: auto auto;
  font-size: 14px;
  color: #777;
  margin-top: 15px;
}

.card-description {
  font-size: 12px;
  color: #777;
  margin-bottom: 5px;
}
.kosong{
  width: 100%;
  height: auto;
  text-align: center;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 700;
}

</style>