<template>
  <v-container fluid fill-height class="white">
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <h3 class="display-3 mb-2">ERROR 404</h3>
        <p class="subtitle-1">
          La página que estas buscando no existe o no está disponible. Intentalo
          de nuevo o más tarde.
        </p>
        <v-btn color="primary" dark @click="goBack">regresar</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'error404',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
