<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="create" color="primary" dark small v-bind="attrs" v-on="on">
        <v-icon left>mdi-plus</v-icon> país
      </v-btn>
      <v-btn v-else icon v-bind="attrs" v-on="on">
        <v-icon color="primary">mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="primary white--text">
        <v-icon left dark>
          {{ create ? 'mdi-plus' : 'mdi-pencil' }}
        </v-icon>
        {{ create ? 'AGREGAR PAÍS' : 'EDITAR PAÍS' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-form
          @submit="postCountry"
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
                v-model="form.name"
                label="Nombre país"
                outlined
                dense
                background-color="white"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="postCountry">
          guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DialogCountry',
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
    },
    country: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false,
      validateForm: true,
      form: { id: null, name: '', region: null }
    };
  },
  watch: {
    dialog: {
      handler() {
        if (!this.create) this.form.name = this.country.name;
      },
      deep: true
    }
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.form = { id: '', name: '', region: null };
      this.$refs.form.resetValidation();
    },
    postCountry() {
      event.preventDefault();
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        const { name } = this.form;
        const data = {
          id: this.country.id,
          name,
          region: this.region.id
        };
        // Si se está creando el pais
        if (this.create) {
          axios.post('/country', data).then(response => {
            this.$emit('create', response.data.data, this.region.id);
          });
        }
        // Si se está editando el pais
        else {
          axios.put('/country', data).then(response => {
            this.$emit('edit', response.data.data);
          });
        }
        this.closeModal();
      }
    }
  }
};
</script>
