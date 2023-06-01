<template>
  <v-ons-page>
    <p class="intro">
      Selamat datang budi nip: 1290837 berikut kegiatan untuk anda .<br><br>
    </p>

    <v-ons-card v-for="page of pages" :key="page.label"
      @click="push(page.component, page.label)"
    >
      <div class="title">{{ page.kegiatan }}</div>
      <div class="content"><v-ons-list>
          <v-ons-list-header>Deskripsi</v-ons-list-header>
          <v-ons-list-item>Lokasi : {{ page.lokasi  }}</v-ons-list-item>
          <v-ons-list-item>Tanggal : {{ page.tanggal }}</v-ons-list-item>
        </v-ons-list></div>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
import Absensi from './Absensi.vue';

export default {
  data () {
    return {
      pages: [
        {
          component: Absensi,
          label :'Absensi',
          kegiatan: 'Penyuluhan tahan pangan',
          lokasi: 'kemiri malo , bojonegoro',
          tanggal: '20/08/23',
        }
      ]
    };
  },

  methods: {
    push(page, key) {
      this.$store.commit('navigator/push', {
        extends: page,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'Home',
              title: key
            }
          }
        }
      });
    }
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
</style>
