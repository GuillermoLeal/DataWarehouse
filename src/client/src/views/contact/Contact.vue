<template>
  <v-row class="pa-8">
    <v-col cols="12" class="d-flex justify-start align-center">
      <v-icon size="36" color="black" left>mdi-book-account</v-icon>
      <h1>Contactos</h1>
    </v-col>
    <v-col cols="12">
      <!-- //? Tabla de usuarios -->
      <ListContacts :search="search" />
    </v-col>
  </v-row>
</template>

<script>
import ListContacts from './ListContacts.vue';

export default {
  name: 'Contactos',
  components: { ListContacts },
  data() {
    return {
      search: ''
    };
  }
};
</script>
