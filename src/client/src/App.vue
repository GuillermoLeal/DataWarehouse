<template>
  <div id="app">
    <v-app id="inspire" style="background-color:#f3f3f3;">
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
