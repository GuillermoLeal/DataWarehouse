<template>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card>
      <v-card-title class="text-h5 primary white--text">
        {{ option ? 'Editar' : 'Agregar' }} Usuario
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form ref="form" v-model="form" lazy-validation>
          <v-row>
            <v-col v-show="alertDialog" cols="12">
              <!-- //? Message -->
              <v-alert :v-model="alertDialog" color="red" dark dismissible>
                {{ message }}
              </v-alert>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="user.name"
                :rules="[
                  v => !!v || 'Campo requerido *',
                  v => /^[a-zA-Z ]+$/.test(v) || 'Solo se permiten letras'
                ]"
                label="Nombre"
                placeholder="ingrese nombre"
                type="text"
                clearable
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="user.lastname"
                :rules="[
                  v => !!v || 'Campo requerido *',
                  v => /^[a-zA-Z ]+$/.test(v) || 'Solo se permiten letras'
                ]"
                label="Apellido"
                placeholder="ingrese apellido"
                type="text"
                clearable
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="user.email"
                :rules="[
                  v => !!v || 'Campo requerido *',
                  v => /.+@.+\..+/.test(v) || 'Formato email no valido'
                ]"
                label="Email"
                placeholder="ingrese email"
                type="email"
                clearable
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0" v-if="!option">
              <v-text-field
                @change="user.copyPassword = null"
                v-model="user.password"
                :rules="[v => !!v || 'Campo requerido *']"
                label="Contraseña"
                placeholder="ingrese contraseña"
                type="password"
                clearable
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0" v-if="!option">
              <v-text-field
                :disabled="!user.password || !user.password.length"
                v-model="user.copyPassword"
                :rules="[
                  v => !!v || 'Campo requerido *',
                  v => v == user.password || 'Las contraseñas deben coincidir'
                ]"
                label="Repetir contraseña"
                placeholder="repita la contraseña"
                type="password"
                clearable
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="user.role"
                :items="profiles"
                :rules="[v => v != null || 'Campo requerido *']"
                label="Perfil"
                dense
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mr-2" color="red" text @click="close">
          cancelar
        </v-btn>
        <v-btn @click="saveUser" color="green" dark class="elevation-0">
          guardar usuario
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DialogUser',
  props: ['item', 'option', 'dialog'],
  data() {
    return {
      form: true,
      profiles: [
        { text: 'Admin', value: true },
        { text: 'Básico', value: false }
      ],
      user: {},
      alertDialog: false,
      message: ''
    };
  },
  watch: {
    option: {
      handler() {
        this.alertDialog = false;
        if (this.option) {
          this.user = { ...this.item };
        } else {
          this.user = {};
        }
        setTimeout(() => {
          this.$refs.form.resetValidation();
        }, 0);
      },
      deep: true
    }
  },
  methods: {
    close() {
      this.$refs.form.reset();
      this.$emit('close');
    },
    validatePassword(value) {
      if (this.option || !!value) {
        return true;
      }
      return 'Campo requerido *';
    },
    saveUser() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.alertDialog = false;
        // Si option es true, se edita el usuario
        if (this.option) {
          axios
            .put('/user', { ...this.user })
            .then(response => {
              const { error, message } = response.data;
              this.message = message;
              this.alertDialog = error;
              if (error) {
                this.colorAlert = 'red';
              } else {
                this.close();
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
        // Si option es false, se agrega el usuario
        else {
          axios
            .post('/auth/register', this.user)
            .then(response => {
              const { error, message } = response.data;
              this.message = message;
              this.alertDialog = error;
              if (error) {
                this.colorAlert = 'red';
              } else {
                this.close();
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    }
  }
};
</script>
