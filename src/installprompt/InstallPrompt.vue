<template>
  <v-ons-dialog v-model="show" cancelable>
    <div style="text-align: center; padding: 20px;">
      <p>Install aplikasi ke layar utama?</p>
      <v-ons-button @click="install" modifier="cta">Install</v-ons-button>
      <v-ons-button @click="show = false">Nanti</v-ons-button>
    </div>
  </v-ons-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      deferredPrompt: null,
    };
  },
  mounted() {
    // Tambahkan listener jika belum pernah dipasang
    if (!window.__pwaPromptAttached) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Cegah browser menampilkan banner default
        e.preventDefault();
        // Simpan event global & lokal
        window.__deferredPrompt = e;
        this.deferredPrompt = e;
        this.show = true; // Tampilkan dialog
      });
      window.__pwaPromptAttached = true;
    } else if (window.__deferredPrompt) {
      // Jika sebelumnya sudah tersimpan (halaman reload), tampilkan langsung
      this.deferredPrompt = window.__deferredPrompt;
      this.show = true;
    }

    // Jika PWA berhasil diinstal
    window.addEventListener('appinstalled', () => {
      this.show = false;
      this.deferredPrompt = null;
      window.__deferredPrompt = null;
      console.log('✅ Aplikasi berhasil diinstal');
    });
  },
  methods: {
    async install() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt(); // HARUS dari user gesture
        const result = await this.deferredPrompt.userChoice;
        console.log('User response:', result.outcome);

        if (result.outcome === 'accepted') {
          console.log('✅ User accepted installation');
        } else {
          console.log('ℹ️ User dismissed installation');
        }

        this.deferredPrompt = null;
        window.__deferredPrompt = null;
        this.show = false;
      }
    }
  }
};
</script>
