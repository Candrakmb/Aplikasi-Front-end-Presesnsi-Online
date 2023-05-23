<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item>
        <div class="center">

          <v-ons-select style="width: 40%; margin-left: 100px;"
            v-model="selectedItem"
          >
            <option v-for="item in items" :value="item.value">
              {{ item.text }}
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
          </v-ons-row><br>
          <span class="label success">absen</span>
        </div>
      </div>
    </v-ons-card>
  </v-ons-page>
</template>
<script>

export default {
  data() {
    return {
      items: [
        { text: ' semua', value: ' semua' },
        { text: ' absen', value: ' absen' },
        { text: ' tidak absen', value: ' tidak absen' }
      ],
      selectedItem: 'Vue'
    };
    
  },
  methods: {
    transition(name) {
      this.$store.commit('navigator/options', {
        // Sets animations
        animation: name,
        // Resets default options
        callback: () => this.$store.commit('navigator/options', {})
      });

      this.$store.commit('navigator/push', {
        extends: transitionPage,
        data() {
          return {
            animation: name
          }
        }
      });
    }
  }
};
</script>
<style>
.label {
  color: white;
  padding: 8px;
}
.text{
  margin-right: 10px;
}
.success {background-color: #04AA6D;} /* Green */
</style>
