<template>
  <v-row class="pa-8">
    <v-col cols="12" class="d-flex justify-start align-center">
      <v-icon size="36" color="black" left>mdi-account-group</v-icon>
      <h1>Usuarios</h1>
    </v-col>
    <v-col cols="12">
      <!-- //? Tabla de usuarios -->
      <ListUsers />
    </v-col>
  </v-row>
</template>

<script>
import ListUsers from './ListUsers.vue';

export default {
  name: 'User',
  components: { ListUsers }
};
</script>
