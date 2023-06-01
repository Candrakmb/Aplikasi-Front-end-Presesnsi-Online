<template>
    <v-ons-page>
      <v-ons-card>
        <v-ons-row style="margin: 20px;" >
    
            <v-ons-col width="50%" >
                <label for="month" style="padding-right: 50%; display: block; padding-bottom: 10px;">Bulan</label>
                <v-ons-select class="month" style="width: 60%" v-model="selectedMonth">
                    <option v-for="month in months" :value="month.value">{{ month.text }}</option>
                </v-ons-select>
            </v-ons-col>
       
            <v-ons-col width="50%">
                <label for="year" style="padding-right: 50%; display: block; padding-bottom: 10px;">Tahun</label>
                <v-ons-select class="year" style="width: 60%" v-model="selectedYear">
                    <option v-for="year in years" :value="year.value">{{ year.text }}</option>
                </v-ons-select>
            </v-ons-col>
        </v-ons-row>
        <v-ons-button @click="submitForm" style="margin: 30px 60%">Submit</v-ons-button>
      </v-ons-card>
     
    </v-ons-page>
  </template>
  <script>
  import CardHistory from './CardHistory.vue';
  
  export default {
    data() {
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        const currentMonth = new Date().getMonth(); // Mengambil bulan saat ini (mulai dari 0)
        const months = [
        { text: 'Januari', value: 'Januari' },
        { text: 'Februari', value: 'Februari' },
        { text: 'Maret', value: 'Maret' },
        { text: 'April', value: 'April' },
        { text: 'Mei', value: 'Mei' },
        { text: 'Juni', value: 'Juni' },
        { text: 'Juli', value: 'Juli' },
        { text: 'Agustus', value: 'Agustus' },
        { text: 'September', value: 'September' },
        { text: 'Oktober', value: 'Oktober' },
        { text: 'November', value: 'November' },
        { text: 'Desember', value: 'Desember' },
        ];
      return {
        months: months,
        selectedMonth: months[currentMonth].value,
        years: [
            { text: String(previousYear), value: String(previousYear) },
            { text: String(currentYear), value: String(currentYear) },
        ],
        selectedYear: String(currentYear),
      };
    },
        methods: {
        submitForm() {
        // Simpan nilai bulan dan tahun dalam localStorage
        localStorage.setItem('selectedMonth', this.selectedMonth);
        localStorage.setItem('selectedYear', this.selectedYear);

        const page = CardHistory; // Ganti '/halaman-lain' dengan rute halaman tujuan
        const key = 'History'+' '+this.selectedMonth+' '+this.selectedYear; // Ganti 'Judul Halaman' dengan judul halaman tujuan
        this.push(page, key);

        // Tampilkan pesan atau lakukan tindakan lain setelah penyimpanan
        console.log('Data berhasil disimpan dalam localStorage');
        },
        push(page, key) {
        this.$store.commit('navigator/push', {
            extends: page,
            data() {
            return {
                toolbarInfo: {
                backLabel: 'History',
                title: key
                }
            }
            }
        });
       }
    },
  };
  </script>
  <style>
  </style>
  