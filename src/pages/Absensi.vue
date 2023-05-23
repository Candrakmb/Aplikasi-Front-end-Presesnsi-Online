<template>
    <v-ons-page>
      <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>

      <v-ons-card >
        <div class="title">
        penyuluhan di......
      </div>
      <div class="content">
        <div id="map" style="width: auto; height: 300px;"></div>
        <div class="peringatan">
          <span :hidden="buttonActive" class="alert error">Anda di luar area!</span>
        </div>
        <v-ons-button modifier="large" :disabled="!buttonActive" style="margin: 6px 0">Absen</v-ons-button>
      </div>
      </v-ons-card>
    </v-ons-page>
  </template>
  
  <script>
  import L from 'leaflet';
  import personIcon from '../assets/person.png';
  import lokasi from '../assets/location.png';
  import { kabupatenBojonegoro } from '../assets/mapping/bojonegoro.js';
  import { test } from '../assets/mapping/test.js';
  export default {
 
  data() {
    return {
      map: null,
      marker: null,
      markerUser: null,
      buttonActive: false,
      userlatlng: null, // inisialisasi koordinat pengguna
      data: null,
      geojson: null,
    };
  },
  mounted() {
    // inisialisasi peta
    this.map = L.map('map').setView([-7.152337581949617,111.88643465470935], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // this.data = L.geoJSON(kabupatenBojonegoro, {
    //     filter: function(feature) {
    //         return feature.properties.name === 'ngraho_ngraho';
    //     }
    // }).addTo(this.map);
    this.data = L.geoJSON(test, {
        filter: function(feature) {
            return feature.properties.name === 'surabaya_surabaya';
        }
    }).addTo(this.map);

        this.getUserPosition();

        // Mulai mendengarkan perubahan lokasi pengguna setelah mendapatkan lokasi pengguna
        this.map.on('locationfound', e => {
          const userlatlng = e.latlng;
      
          // Panggil fungsi untuk memeriksa jarak dan lokasi pengguna
          this.checkUserLocation(userlatlng);
        });

        // Perbarui lokasi pengguna setiap 5 detik
        setInterval(() => this.getUserPosition(), 5000);
  },
  methods: {
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
        
        this.map.setView(this.userlatlng, 13);
  
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
    this.buttonActive = this.data.getBounds().contains(userLatLng);
    if (!this.buttonActive) {
        this.$ons.notification.toast('Anda di Luar Area!', { timeout: 2000, animation: 'fall' });
      }
  },

    // haversineDistance(lat1, lon1, lat2, lon2) {
    //     const R = 6371e3; // radius bumi dalam meter
    //     const phi1 = lat1 * Math.PI / 180;
    //     const phi2 = lat2 * Math.PI / 180;
    //     const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    //     const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    //     const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    //     Math.cos(phi1) * Math.cos(phi2) *
    //     Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    //     const distance = R * c;
    //     return distance;
    //   }
  }
  
};
  </script>
  
  <style>
  .intro {
    text-align: left;
    padding: 0 22px;
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.4;
    color: rgba(0, 0, 0, .54);
  }
  
  ons-card {
    cursor: pointer;
    color: #333;
  }
  
  .card__title, .card--material__title {
    font-size: 20px;
  }

  .leaflet-marker-icon,
.leaflet-marker-shadow {
  margin-top: -12px;
  margin-left: -12px;
  width: 25px;
  height: 41px;
}

/* Mengubah posisi ikon bayangan marker */
.leaflet-marker-shadow {
  z-index: -1;
  width: 41px;
  height: 41px;
  margin-top: -10px;
  margin-left: -12px;
}
.peringatan{
 padding: 20px;
}
.alert {
  padding: 10px;
  text-align: center;
  position: relative;
  color: white;
  border-radius: 5px;
  margin-left: 80px;
  box-shadow: 10px 5px;
}
.error {background-color: #c90b0b;} /* Green */
  </style>
  