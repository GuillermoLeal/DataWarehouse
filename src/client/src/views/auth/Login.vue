<template>
  <v-container class="blue lighten-3" fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar
            dark
            color="primary"
            class="d-flex justify-center align-center"
          >
            <v-toolbar-title>
              <v-icon left>mdi-shield-lock</v-icon>
              Iniciar Sesión
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-alert v-model="alert" dense outlined type="error" dismissible>
              {{ message }}
            </v-alert>
            <v-form ref="form" v-model="form" lazy-validation>
              <v-text-field
                :rules="[v => !!v || 'Campo requerido *']"
                prepend-icon="mdi-account"
                v-model="email"
                label="Email"
                type="text"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                :rules="[v => !!v || 'Campo requerido *']"
                prepend-icon="mdi-lock"
                v-model="password"
                label="Contraseña"
                type="password"
                outlined
                dense
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      alert: false,
      form: true,
      message: '',
      email: '',
      password: ''
    };
  },
  methods: {
    login() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        const data = {
          email: this.email,
          password: this.password
        };

        axios
          .post('/api/auth/login', data)
          .then(response => {
            const { error, message, token, user } = response.data;
            if (error) {
              this.message = message;
              this.alert = true;
            } else {
              this.alert = false;
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              this.$router.push('/contactos');
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
