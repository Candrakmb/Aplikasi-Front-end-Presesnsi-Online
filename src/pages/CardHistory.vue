<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
    
    <v-ons-list style="margin-top: 10px;" >
      <v-ons-list-item>
        <div class="center">

          <v-ons-select style="width: 40%"
            v-model="selectedItem"
          >
            <option v-for="status in status" :value="status.value">
              {{ status.text }}
            </option>
          </v-ons-select>

        </div>
      </v-ons-list-item>
    </v-ons-list>
    <v-ons-card>
      <div class="title">
        Awesome framework
      </div>
      <div class="content">
        <div>
          <v-ons-row>
            <v-ons-col width="20px" vertical-align="center">
              <v-ons-icon icon="md-face"></v-ons-icon>
            </v-ons-col>
            <v-ons-col  vertical-align="center">
              <p class="text" >okooko</p>
            </v-ons-col >
            <v-ons-col width="20px" vertical-align="center">
              <v-ons-icon icon="md-face"></v-ons-icon>
            </v-ons-col>
            <v-ons-col vertical-align="center">
              <p>okookok</p>
            </v-ons-col >
          </v-ons-row>
           
          <span class="label success">Absen</span>
        </div>
      </div>
    </v-ons-card>
  </v-ons-page>
</template>
<script>

export default {
  data() {
    return {
      selectedMonth: '',
      selectedYear: '',
      status: [
        { text: ' All', value: ' All' },
        { text: ' Absen', value: ' absen' },
        { text: ' Tidak absen', value: ' tidak absen' }
      ],
      selectedStatus: 'semua',
    };
  },
  mounted() {
    // Mendapatkan nilai bulan dan tahun dari localStorage
    this.selectedMonth = localStorage.getItem('selectedMonth');
    this.selectedYear = localStorage.getItem('selectedYear');

    // Melakukan tindakan lain dengan nilai bulan dan tahun yang didapatkan
  },
};
</script>
<style>
.label {
  font-size: 20px;
}
.text{
  margin-right: 10px;
}
.success{
  color: rgb(35, 187, 21);
}
.error{
  color: red;
}
</style>
