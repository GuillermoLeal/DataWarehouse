<template>
  <v-app-bar v-show="validate" color="primary" dark class="pr-4">
    <v-toolbar-title>
      <v-list-item link>
        <v-list-item-avatar>
          <v-icon size="42">mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ fullName }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <router-link :to="nav.redirect" v-for="nav in navsUser" :key="nav.title">
      <v-btn color="transparent" class="elevation-0">
        {{ nav.title }}
      </v-btn>
    </router-link>

    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      fullName: '',
      role: null,
      navs: [
        {
          title: 'Contactos',
          icon: 'mdi-book-account',
          redirect: '/contactos',
          admin: false
        },
        {
          title: 'Compañías',
          icon: 'mdi-home-city',
          redirect: '/companias',
          admin: false
        },
        {
          title: 'Usuarios',
          icon: 'mdi-account-group',
          redirect: '/usuarios',
          admin: true
        },
        {
          title: 'Región / Ciudad',
          icon: 'mdi-earth',
          redirect: '/regiones-ciudades',
          admin: false
        }
      ]
    };
  },
  computed: {
    validate() {
      this.getInfoUser();
      return !(this.$route.name == 'Login' || this.$route.name == 'Error404');
    },
    navsUser() {
      return this.navs.filter(
        nav => nav.admin == false || nav.admin == this.role || this.role == 3
      );
    }
  },
  methods: {
    getInfoUser() {
      const info = JSON.parse(localStorage.getItem('user'));
      if (info) {
        this.email = info.email;
        this.fullName = `${info.name} ${info.lastname}`;
        this.role = info.role;
      }
    },
    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.$router.push('/');
    }
  }
};
</script>
