<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
    
    <v-ons-list style="margin-top: 10px;" >
      <v-ons-list-item>
        <div class="center">

          <v-ons-select  style="width: 40%"
            v-model="selectedItem"
          >
            <option  v-for="item in items" :value="item.value">
              {{ item.text }}
            </option>
          </v-ons-select>

        </div>
      </v-ons-list-item>
    </v-ons-list>
          <div class="card-wrapper">
          <v-ons-card class="card" v-for="page of  pageHistory" :key="page.taskDetailsId">
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
                <div class="status"  :class="{ 'green-text': page.statusAbsensi === 'Absen', 'red-text': page.statusAbsensi === 'Alfa' }">Status : {{ page.statusAbsensi }}</div>
              </div>
            </div>
          </v-ons-card>
        </div>
        <div :hidden="!textKosong" class="kosong">
        <p class="text-kosong">Tidak Ada History Bulan ini</p>
      </div>
  </v-ons-page>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      selectedMonth: localStorage.getItem('selectedMonth'),
      selectedYear: localStorage.getItem('selectedYear'),
      pageHistory:[],
      textKosong:false,
      nameMonth: '',
      items: [
        { text: 'Semua', value: 'Semua' },
        { text: 'Absen', value: 'Absen' },
        { text: 'Alfa', value: 'Alfa' }
      ],
      selectedItem: 'Semua',
    };
  },
  watch: {
  selectedItem: {
    handler(newSelectedItem, oldSelectedItem) {
      // Memanggil fetchData() ketika selectedItem berubah
      this.fetchData();
    },
    immediate: true // Memanggil handler saat ini juga saat komponen dibuat
  }
},
  methods : {
    async fetchData() {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
              month: this.selectedMonth,
              year: this.selectedYear,
          },
        };
        const response = await axios.get('http://127.0.0.1:8000/api/tasks/history', config);
        const tasks = response.data.tasks;
        const taskDetails = response.data.task_details;

        this.pageHistory = [];

        if (tasks.length > 0 && taskDetails.length > 0) {
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
                  status:detail.status,
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

                if (data.status === '0' && this.selectedItem === 'Alfa' ) {
                  data.statusAbsensi='Alfa';
                  this.pageHistory.push(data);
                } else if( data.status === '1' && this.selectedItem === 'Absen') {
                  data.statusAbsensi='Absen';
                  this.pageHistory.push(data);
                } else if (this.selectedItem === 'Semua'){
                  if(data.status === '0'){
                    data.statusAbsensi='Alfa';
                  }else{
                    data.statusAbsensi='Absen';
                  }
                  this.pageHistory.push(data);
                }
              });
            }
          });
          this.isLoading = false;
          this.textKosong=false;
          console.log(this.pageHistoryAlfa)
        }
        if (this.pageHistory.length === 0 && this.pageHistory.length === 0) {
            this.textKosong=true;
          }
      } catch (error) {
        console.log(error);
      }
    },
  }
};
</script>
<style scoped>
.kosong{
  width: 100%;
  height: auto;
  text-align: center;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 700;
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
.status{
  font-size: 15px;
  margin-top: 10px;
}
.green-text {
  color: green;
}

.red-text {
  color: red;
}
</style>
