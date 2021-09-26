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
      <v-card-title class="primary white--text">
        <v-icon left dark>
          {{ create ? 'mdi-plus' : 'mdi-pencil' }}
        </v-icon>
        {{ create ? 'AGREGAR USUARIO' : 'EDITAR USUARIO' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-form v-model="validateForm" ref="form" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-alert v-show="alertDialog" color="red" dark dismissible>
                {{ message }}
              </v-alert>
            </v-col>
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
              <v-text-field
                :rules="[
                  v => !!v || 'El apellido es requerido',
                  v =>
                    v.length <= 50 ||
                    'El apellido debe tener menos de 50 caracteres',
                  v =>
                    v.length >= 3 ||
                    'El apellido debe tener más de 3 caracteres'
                ]"
                v-model="form.lastname"
                label="Apellido"
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
            <v-col cols="12" v-if="create">
              <v-text-field
                :rules="[
                  v => !!v || 'La contraseña es requerido',
                  v =>
                    v.length <= 50 ||
                    'La contraseña debe tener menos de 50 caracteres',
                  v =>
                    v.length >= 3 ||
                    'La contraseña debe tener más de 3 caracteres'
                ]"
                v-model="form.password"
                label="Contraseña"
                outlined
                dense
                background-color="white"
                type="password"
              ></v-text-field>
            </v-col>
            <v-col cols="12" v-if="create">
              <v-text-field
                :rules="[
                  v => !!v || 'Repetir la contraseña es requerido',
                  v => v === form.password || 'Las contraseñas no coinciden'
                ]"
                v-model="form.repeatPassword"
                label="Repetir contraseña"
                outlined
                dense
                background-color="white"
                type="password"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-if="roleUser && create"
                :rules="[v => !!v || v == 0 || 'El perfil es requerido']"
                v-model="form.role"
                :items="roles"
                item-text="name"
                item-value="id"
                label="Perfil"
                outlined
                dense
                background-color="white"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="postUser">
          guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DialogUser',
  props: {
    textBtn: {
      type: String,
      default: 'textBtn'
    },
    emailUser: {
      type: String,
      default: ''
    },
    roleUser: {
      type: Boolean,
      default: false
    },
    create: {
      type: Boolean,
      default: true
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false,
      alertDialog: false,
      message: '',
      validateForm: true,
      roles: [
        { id: 0, name: 'Básico' },
        { id: 1, name: 'Admin' }
      ],
      form: {
        id: null,
        name: '',
        lastname: '',
        email: '',
        password: '',
        repeatPassword: '',
        role: 0
      }
    };
  },
  watch: {
    dialog: {
      handler() {
        if (!this.create) {
          this.form = {
            id: this.user.id,
            name: this.user.name,
            lastname: this.user.lastname,
            email: this.user.email,
            role: this.user.role ? 1 : 0
          };
        }
      },
      deep: true
    }
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.form = {
        id: null,
        name: '',
        lastname: '',
        email: '',
        password: '',
        repeatPassword: '',
        role: 0
      };
      this.$refs.form.resetValidation();
    },
    postUser() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        const data = { ...this.form };
        // Si se está creando el Usuario
        if (this.create) {
          axios.post('/auth/register', data).then(response => {
            const { error, message } = response.data;
            this.message = message;
            this.alertDialog = error;
            if (!error) {
              this.$emit('create');
              this.closeModal();
            }
          });
        }
        // Si se está editando el Usuario
        else {
          axios.put('/user', data).then(response => {
            const { error, message } = response.data;
            this.message = message;
            this.alertDialog = error;

            // Si es el mismo usuario logueado editandose... se tiene que volver a loguear
            if (this.form.email == this.emailUser) {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              this.$router.push('/');
            }

            if (!error) {
              this.$emit('edit');
              this.closeModal();
            }
          });
        }
      }
    }
  }
};
</script>
