<template>
  <v-row class="pa-8">
    <v-col cols="12">
      <h1>Usuarios</h1>
    </v-col>
    <v-col cols="12" md="6" lg="4">
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        placeholder="buscar..."
        hide-details
        outlined
        dense
        clearable
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6" lg="8" class="d-flex justify-end align-center">
      <v-btn color="primary" dark>
        <v-icon>mdi-plus</v-icon>
        Agregar Usuario
      </v-btn>
    </v-col>
    <v-col cols="12">
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
