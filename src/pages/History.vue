<template>
    <v-ons-page>
      <div class="card-history">
        <div class="info-history">
          <p class="title">Form History</p>
          <p class="subtitle">Pilih bulan dan tahun yang ingin dilihat history absensi</p>
        </div>
      </div>
      <v-ons-card class="card-content">
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
        <v-ons-button modifier="large" @click="submitForm">Submit</v-ons-button>
      </v-ons-card>
     
    </v-ons-page>
  </template>
  <script>
  import CardHistory from './CardHistory.vue';
  
  export default {
      data() {
          const currentYear = new Date().getFullYear();
          const previousYear = currentYear - 1;
          const currentMonth = new Date().getMonth() + 1; // Mengambil bulan saat ini (dimulai dari 1)
          const months = [];

          for (let i = currentMonth; i >= 1; i--) {
            months.push(i);
          }

          const previousMonths = months.map(month => {
            return { text: this.getMonthName(month), value: month };
          });

          return {
            months: previousMonths.reverse(),
            selectedMonth: currentMonth,
            years: [
              { text: String(previousYear), value: String(previousYear) },
              { text: String(currentYear), value: String(currentYear) },
            ],
            selectedYear: String(currentYear),
          };
        },
        methods: {
          getMonthName(month) {
            const monthNames = [
              "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
              "Agustus", "September", "Oktober", "November", "Desember"
            ];
            return monthNames[month - 1];
          },
        submitForm() {
        // Simpan nilai bulan dan tahun dalam localStorage
        localStorage.setItem('selectedMonth', this.selectedMonth);
        localStorage.setItem('selectedYear', this.selectedYear);
       
        const page = CardHistory;
        const key = 'History'+' '+ this.getMonthName(this.selectedMonth) + ' ' +this.selectedYear;
        this.push(page, key);

        },
        push(page, key) {
        this.$store.commit('navigator/push', {
            extends: page,
            data() {
            return {
                toolbarInfo: {
                backLabel: 'History',
                title: key
                },
                year:this.selectedYear,
                month:this.selectedYear
            }
            }
        });
       }
    },
  };
  </script>
  <style scoped>
  .card-history{
    position: fixed;
    width: 100%;
    height: 40%;
    background: rgb(8, 131, 149);
    z-index: -1;
    text-align: center;
    border-radius: 0 0 30px 30px;
  }
  .card-content{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 150px;
    border-radius: 10px;
  }
  .title{
    font-size: 20px;
    color: #fff;
    font-weight: 600;
    margin-top: 40px;
  }
  .subtitle{
    font-size: 16px;
    color: #ffffff;
  }
  </style>
  