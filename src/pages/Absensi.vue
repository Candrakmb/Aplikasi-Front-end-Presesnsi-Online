<template>
    <v-ons-page>
      <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
      <div id="map" ></div>
      <div :hidden="buttonActive" class="card_alert">
          <div class="content_alert">
              <v-ons-icon icon="ion-alert-circled"></v-ons-icon>
            <span>Anda di luar Area Atau Belum Harinya</span>
            </div>
          </div>
      <div class="card">
        <div class="kalender">
                <div class="card-description nama_bulan" >{{ bulan }}</div>
                <div class="card-description nama_hari">{{ hari }}</div>
                <div class="card-description tanggal">{{ tanggal }}</div>
                <div class="card-description tahun">{{ tahun }}</div>
            </div>
            <div class="informasi">
              <div class="card-title">{{ keterangan }}</div>
              <div class="card-subtitle"><v-ons-icon icon="ion-map"></v-ons-icon>
              <span>{{ hanyaDesa }}, {{ kecamatan }}</span></div>
            </div>
            <div class="button_absensi">
              <v-ons-button modifier="large"  style="margin: 6px 0" @click="submitAttendance" >Absen</v-ons-button>
            </div>
      </div>
      <v-ons-alert-dialog style="
      text-align: center;" modifier="rowfooter" :visible.sync="alertDialogVisible">
          <span class="title-alert">Absen</span><br><br>
          <span class="subtitle-alert">Absensi Berhasil</span>
          <template slot="footer">
            <v-ons-back-button @click="closeAlertDialog()">Back</v-ons-back-button>
          </template>
    </v-ons-alert-dialog>
    
    </v-ons-page>
  </template>
  
  <script>
  import L from 'leaflet';
  import Home from './Home.vue';
  import personIcon from '../assets/person.png';
  import { kabupatenBojonegoro } from '../assets/mapping/bojonegoro.js';
  import { test } from '../assets/mapping/test.js';
  import axios from 'axios';
  export default {
 
  data() {
    return {
      map: null,
      marker: null,
      markerUser: null,
      buttonActive: false,
      userlatlng: null, // inisialisasi koordinat pengguna
      data: null,
      mapping:null,
      geojson: null,
      executionDate: null,
      alertDialogVisible: false,
    };
  },

  mounted() {
    const { kecamatan, desa, kegiatan, checkDate} = this.$data;
    this.executionDate= checkDate;
    
    // inisialisasi peta
    this.map = L.map('map', {
                zoomControl: false
              }).setView([-7.152337581949617,111.88643465470935], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // this.data = L.geoJSON(kabupatenBojonegoro).addTo(this.map);
    this.mapping = L.geoJSON(kabupatenBojonegoro, {
        filter: function(feature) {
            return feature.properties.name === desa;
        }
    }).addTo(this.map);

        this.getUserPosition();

        // Mulai mendengarkan perubahan lokasi pengguna setelah mendapatkan lokasi pengguna
        this.map.on('locationfound', e => {
          const userlatlng = e.latlng;
      
          // Panggil fungsi untuk memeriksa jarak dan lokasi pengguna
          this.checkUserLocation(userlatlng);
        });
        
  },
  methods: {
    closeAlertDialog() {
      this.alertDialogVisible = false;
    },
    async submitAttendance() {
          const { user_id, taskDetailsId } = this.$data;
          const postData = {
            id: user_id,
            taskdetails_id: taskDetailsId,
            latitude: null,
            longitude: null
          };

          try {
            const token = localStorage.getItem('token');
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };

            

            // Mendapatkan posisi geografis pengguna
            navigator.geolocation.getCurrentPosition(
              position => {
                postData.latitude = position.coords.latitude;
                postData.longitude = position.coords.longitude;

                // Kirim data posisi dan informasi hadir ke server
                axios.post('http://127.0.0.1:8000/api/attendance/post', postData, config)
                  .then(response => {
                    this.alertDialogVisible = true;
                  })

                  .catch(error => {
                    console.error(error);
                  });
              },
              error => {
                console.error(error);
              }
            );
           
          } catch (error) {
            console.error(error);
          }
      },
    generateCirclePolygon() {
      var angleStep = (2 * Math.PI) / this.numPoints;

      for (var i = 0; i < this.numPoints; i++) {
        var angle = i * angleStep;
        var x = this.center[0] + (this.radius / (111320 * Math.cos(this.center[1] * Math.PI / 180))) * Math.cos(angle); // Konversi radius ke meter
        var y = this.center[1] + (this.radius / 111320) * Math.sin(angle); // Konversi radius ke meter
        this.coordinates.push([x, y]);
      }

      // Menambahkan titik awal untuk menghasilkan polygon yang tertutup
      this.coordinates.push(this.coordinates[0]);
    },

    getUserPosition() {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLatLng = L.latLng(
            position.coords.latitude,
            position.coords.longitude
          );
      
      if (!this.userlatlng || !this.userlatlng.equals(userLatLng)) {
        // Hanya lakukan pengaturan ulang tampilan jika posisi pengguna berubah
        this.userlatlng = userLatLng;

        if (this.markerUser) {
          this.map.removeLayer(this.markerUser);
        }
        
        // Tambahkan marker pengguna baru
        this.markerUser = L.marker(this.userlatlng, {
          icon: L.icon({
            iconUrl: personIcon,
            iconSize: [40, 41],
            iconAnchor: [12, 41]
          })
        }).addTo(this.map); 
        
        this.map.setView(this.userlatlng, 15);
  
        // Panggil fungsi untuk mengecek jarak dan lokasi pengguna
        this.checkUserLocation(this.userlatlng);
      }
    },
    error => {
      console.error(error);
    },
    { enableHighAccuracy: true } // aktifkan mode akurasi tinggi
  );
},

  checkUserLocation(userLatLng) {
    const isLocationValid = this.mapping.getBounds().contains(userLatLng);

    const today = new Date();
    const executionDate = new Date(this.executionDate); // Tambahkan ini
      const isExecutionDateToday =
      today.getDate() === executionDate.getDate() && // Perbaiki ini
        today.getMonth() === executionDate.getMonth() && // Perbaiki ini
        today.getFullYear() === executionDate.getFullYear(); // Perbaiki ini

      // Memeriksa apakah lokasi dan tanggal saat ini sesuai
      this.buttonActive = isLocationValid && isExecutionDateToday;
  },

    push(page) {
        this.$store.commit('navigator/push', {
            extends: page,
        });
       }
  }
  
};
  </script>
  
  <style scoped>
  .title-alert{
    font-size: 20px;
    font-weight: 600;
    margin-left: 37%;
    margin-right: auto;

  }
  .subtitle-alert{
    margin-left: 23%;
    margin-right: auto;
  }
  #map {
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    position: absolute;
    z-index: -1;
  }
  
  .card{
    display: grid;
    grid-template-areas: 'kalender informasi'
    'button button';
    position: absolute;
    width: 95%;
    height: auto;
    background: #fff;
  }
  
  .card__title, .card--material__title {
    font-size: 20px;
  }

  .card_alert{
    position: fixed;
    margin-top: 250px;
    margin-left: 10px;
    width: 95%;
    height: 30px;
    background: #f80303 ;
    border-radius: 20px;
    box-shadow: 0 8px 4px rgba(0, 0, 0, 0.2);
  }

  .content_alert{
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    padding: 5px;
  }
  .card_alert .ons-icon{
    margin-right: 20px;
    color: white;
  }
  
  .card_alert span{
    font-weight: 600;
    color: #fff;
  }
  .card_alert .ons-icon{
      margin-top: 3px;
  }

  .kalender {
  margin-right: 20px;
  margin-left: 5px;
  grid-area: kalender;
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
  grid-area: informasi;
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
.button_absensi{
  margin-top: 15px;
  grid-area: button;
}
  </style>
  