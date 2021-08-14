<template>
  <div id="app">
    <v-app id="inspire">
      <v-main>
        <Navbar />
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
export default {
  components: {
    Navbar
  }
};
</script>
