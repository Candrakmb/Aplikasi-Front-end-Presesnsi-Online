<template>
    <v-ons-page>
      <v-ons-card >
        <div class="title">
        penyuluhan di......
      </div>
      <div class="content">
        <div id="map" style="width: auto; height: 300px;"></div>
        <textarea :hidden="buttonActive" class="textarea textarea--transparent" rows="3" placeholder="Anda diluar area absen"></textarea>
        <v-ons-button modifier="large" :disabled="!buttonActive" style="margin: 6px 0">Absen</v-ons-button>
      </div>
      </v-ons-card>
    </v-ons-page>
  </template>
  
  <script>
  import L from 'leaflet';
  

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // radius bumi dalam meter
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }
  export default {
  data() {
    return {
      map: null,
      marker: null,
      markerUser: null,
      buttonActive: false,
      range: 2000, // jarak range dalam meter
      userlatlng: null // inisialisasi koordinat pengguna
    };
  },
  mounted() {
    // inisialisasi peta
    this.map = L.map('map').setView([-7.152337581949617,111.88643465470935], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    
    // tambahkan marker dan range pada peta
    this.marker = L.marker([-7.329268254466761, 112.78410458248831]).addTo(this.map);
    const range = L.circle([-7.329268254466761, 112.78410458248831], {
      radius: this.range,
      color: 'blue',
      opacity: 0.5,
      fillOpacity: 0.1
    }).addTo(this.map);
    
    // buat event listener pada peta untuk menghitung jarak dan lokasi pengguna
    const getUserPosition = new Promise((resolve, reject) => {
      navigator.geolocation.watchPosition(
        position => {
          const userLatLng = L.latLng(
            position.coords.latitude,
            position.coords.longitude
          );
          this.userlatlng = userLatLng;
          this.map.setView(userLatLng, 13);
          resolve(userLatLng);
        },
        error => {
          reject(error);
        },
        { enableHighAccuracy: true } // aktifkan mode akurasi tinggi
      );
    });

    // setelah posisi pengguna diperoleh, mulai mendengarkan event mousemove
    // cek jarak antara pengguna dan range setiap perubahan lokasi pengguna
    this.map.on('locationfound', e => {
      const userlatlng = e.latlng;

      if (this.markerUser) {
        this.map.removeLayer(this.markerUser);
      }
      
      this.markerUser=L.marker(userlatlng ,{
        icon: L.icon({
              iconUrl: 'person.png',
              iconSize: this.dynamicSize,
              iconAnchor: this.dynamicAnchor
              })
      }).addTo(this.map); 

      const distance = haversineDistance(userlatlng.lat, userlatlng.lng, range.getLatLng().lat, range.getLatLng().lng);
      this.buttonActive = distance <= this.range;
    });

    // minta izin dan perbarui lokasi pengguna setiap 5 detik
    this.map.locate({ setView: false, watch: true, enableHighAccuracy: true, maximumAge: 0 });
    setInterval(() => this.map.locate({ setView: false, watch: true, enableHighAccuracy: true, maximumAge: 0 }), 5000);
  },
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
  </style>
  