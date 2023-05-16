import 'onsenui/css/onsenui.css'; // Onsen UI basic CSS
// import 'onsenui/css/onsen-css-components.css'; // Default Onsen UI CSS components
import './onsen-css-components.css'; // Onsen UI CSS components source for custom themes (requires cssnext)
import './vue-onsenui-kitchensink.css'; // CSS specific to this app

import Vue from 'vue';
import Vuex from 'vuex';
import VueOnsen from 'vue-onsenui'; // For UMD
// import VueOnsen from 'vue-onsenui/esm'; // For ESM
// import * as OnsenComponents from './onsen-components'; // For ESM
import storeLike from './store.js';
import CustomToolbar from './partials/CustomToolbar.vue';
import AppNavigator from './AppNavigator.vue';
import Login from './Login.vue'
import 'leaflet/dist/leaflet.css';
import eventBus from './eventBus';

Vue.use(Vuex);
Vue.use(VueOnsen);

// Register components globally
// Object.values(OnsenComponents).forEach(component => Vue.component(component.name, component)); // For ESM
Vue.component('custom-toolbar', CustomToolbar); // Common toolbar

new Vue({
  el: '#app',
  data: {
    loggedIn: false
  },
  render: function (h) {
    if (this.loggedIn) {
      return h(AppNavigator);
    } else {
      return h(Login);
    }
  },
  store: new Vuex.Store(storeLike),
  beforeCreate() {
    // Shortcut for Material Design
    Vue.prototype.md = this.$ons.platform.isAndroid();

    // Set iPhoneX flag based on URL
    if (window.location.search.match(/iphonex/i)) {
      document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
      document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
    }
  },
  created() {
    const loggedInStatus = localStorage.getItem('loggedIn');

    // Jika ada status login yang tersimpan, gunakan nilainya
    if (loggedInStatus) {
      this.loggedIn = JSON.parse(loggedInStatus);
    }

    eventBus.$on('loginSuccess', () => {
      this.loggedIn = true;
      // Simpan status login di Local Storage
      localStorage.setItem('loggedIn', JSON.stringify(true));
    });

    eventBus.$on('logout', () => {
      this.loggedIn = false;
      // Hapus status login dari Local Storage saat logout
      localStorage.removeItem('loggedIn');
    });
  }
});
