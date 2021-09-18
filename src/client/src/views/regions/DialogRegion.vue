<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on">
        <v-icon>mdi-plus</v-icon>
        {{ textBtn }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <v-icon left color="black">mdi-plus</v-icon>
        {{ create ? 'AGREGAR REGIÓN' : 'EDITAR REGIÓN' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon color="red">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4 blue-grey lighten-5">
        <v-form
          @submit="postRegion"
          v-model="validateForm"
          ref="form"
          lazy-validation
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                :rules="[
                  v => !!v || 'El nombre es requerido',
                  v =>
                    v.length <= 20 ||
                    'El nombre debe tener menos de 20 caracteres',
                  v =>
                    v.length >= 3 || 'El nombre debe tener más de 3 caracteres'
                ]"
                v-model="nameRegion"
                label="Nombre región"
                outlined
                dense
                background-color="white"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="postRegion">
          guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DialogRegion',
  props: {
    textBtn: {
      type: String,
      default: 'textBtn'
    },
    create: {
      type: Boolean,
      default: true
    },
    region: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false,
      validateForm: true,
      nameRegion: ''
    };
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.nameRegion = '';
      this.$refs.form.resetValidation();
    },
    postRegion() {
      event.preventDefault();
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        const data = {
          name: this.nameRegion,
          id: this.region.id
        };
        // Si se está creando la region
        if (this.create) {
          axios.post('/region', data).then(response => {
            this.$emit('create', response.data.data);
          });
        }
        // Si se está editando la region
        else {
          axios.put('/region', data).then(response => {
            this.$emit('edit', response.data.data);
          });
        }
        this.closeModal();
      }
    }
  }
};
</script>
