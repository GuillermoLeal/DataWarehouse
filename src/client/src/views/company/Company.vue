<template>
  <v-row class="pa-8">
    <v-col cols="12" class="d-flex justify-start align-center">
      <v-icon size="36" color="black" left>mdi-home-city</v-icon>
      <h1>Compañías</h1>
    </v-col>
    <v-col cols="12">
      <!-- //? Tabla de usuarios -->
      <ListCompanies :search="search" />
    </v-col>
  </v-row>
</template>

<script>
import ListCompanies from './ListCompanies.vue';

export default {
  name: 'User',
  components: { ListCompanies },
  data() {
    return {
      search: ''
    };
  }
};
</script>
