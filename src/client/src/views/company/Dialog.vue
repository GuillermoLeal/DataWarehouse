<template>
  <v-dialog v-model="dialog" persistent width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="create" color="primary" dark v-bind="attrs" v-on="on">
        <v-icon left>mdi-plus</v-icon> agregar comañía
      </v-btn>
      <v-btn v-else icon v-bind="attrs" v-on="on">
        <v-icon color="primary">mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <v-icon left color="black">
          {{ create ? 'mdi-plus' : 'mdi-pencil' }}
        </v-icon>
        {{ create ? 'AGREGAR COMPAÑÍA' : 'EDITAR COMPAÑÍA' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon color="red">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4 blue-grey lighten-5">
        <v-form v-model="validateForm" ref="form" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                :rules="[
                  v => !!v || 'El nombre es requerido',
                  v =>
                    v.length <= 50 ||
                    'El nombre debe tener menos de 50 caracteres',
                  v =>
                    v.length >= 3 || 'El nombre debe tener más de 3 caracteres'
                ]"
                v-model="form.name"
                label="Nombre"
                outlined
                dense
                background-color="white"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                :rules="[v => !!v || 'La ciudad es requerido']"
                v-model="form.city"
                :items="cities"
                item-text="name"
                item-value="id"
                label="Ciudad"
                outlined
                dense
                background-color="white"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :rules="[
                  v => !!v || 'La dirección es requerido',
                  v =>
                    v.length <= 50 ||
                    'La dirección debe tener menos de 50 caracteres',
                  v =>
                    v.length >= 3 ||
                    'La dirección debe tener más de 3 caracteres'
                ]"
                v-model="form.address"
                label="Dirección"
                outlined
                dense
                background-color="white"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :rules="[
                  v => !!v || 'El email es requerido',
                  v => /.+@.+\..+/.test(v) || 'El email no es válido'
                ]"
                v-model="form.email"
                label="Email"
                outlined
                dense
                background-color="white"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :rules="[
                  v => !!v || 'El telefono es requerido',
                  v => /^[0-9]/.test(v) || 'El telefono no es válido'
                ]"
                v-model="form.telephone"
                label="Telefono"
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
        <v-btn color="primary" @click="postCompany">
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
    company: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false,
      validateForm: true,
      cities: [],
      form: {
        id: null,
        name: '',
        address: '',
        email: '',
        telephone: '',
        city: null
      }
    };
  },
  created() {
    this.getCities();
  },
  watch: {
    dialog: {
      handler() {
        if (!this.create) {
          this.form.id = this.company.id;
          this.form.name = this.company.name;
          this.form.address = this.company.address;
          this.form.email = this.company.email;
          this.form.telephone = this.company.telephone;
          this.form.city = this.company.city;
        }
      },
      deep: true
    }
  },
  methods: {
    getCities() {
      axios
        .get('/city')
        .then(response => {
          this.cities = response.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    closeModal() {
      this.dialog = false;
      this.form = {
        id: null,
        name: '',
        address: '',
        email: '',
        telephone: '',
        city: null
      };
      this.$refs.form.resetValidation();
    },
    postCompany() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        const data = { ...this.form };
        // Si se está creando la compañía
        if (this.create) {
          axios.post('/company', data).then(() => {
            this.$emit('create');
          });
        }
        // Si se está editando la compañía
        else {
          axios.put('/company', data).then(response => {
            this.$emit('edit', response.data.data);
          });
        }
        this.closeModal();
      }
    }
  }
};
</script>
