<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="option == 'btn-large'"
        color="red"
        dark
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>mdi-delete</v-icon>
        eliminar seleccionados
      </v-btn>
      <v-btn v-else icon v-bind="attrs" v-on="on">
        <v-icon color="red">mdi-delete</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="red--text">
        <v-icon left color="red">mdi-delete</v-icon>
        {{ title }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon color="red">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <p class="title">{{ text }}</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="closeModal">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click="accept">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogDelete',
  props: {
    option: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'textBtn'
    },
    text: {
      type: String,
      default: 'textBtn'
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    closeModal() {
      this.dialog = false;
    },
    accept() {
      this.$emit('accept');
      this.dialog = false;
    }
  }
};
</script>
