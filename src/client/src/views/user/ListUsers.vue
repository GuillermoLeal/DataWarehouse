<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          background-color="white"
          placeholder="buscar..."
          hide-details
          outlined
          dense
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="8" class="d-flex justify-end align-center">
        <DialogDelete
          v-if="selectedItems.length"
          option="btn-large"
          title="Eliminar usuarios"
          :text="`¿Está seguro que desea eliminar los usuarios seleccionados?`"
          @accept="deleteUsers(true)"
        />
        <div class="ml-4">
          <DialogUser :roleUser="roleUser" @create="getData" :create="true" />
        </div>
      </v-col>
    </v-row>
    <!-- //? LISTA DE COMAÑIAS -->
    <v-data-table
      v-model="selectedItems"
      item-key="id"
      show-select
      :loading="loading"
      :headers="headers"
      :items="items"
      class="elevation-3"
      multi-sort
      :options.sync="options"
      :server-items-length="totalItems"
      :footer-props="{
        itemsPerPageText: 'Filas por página',
        'items-per-page-options': [5, 10, 25]
      }"
    >
      <template v-slot:item.role="{ item }">
        {{ item.role ? 'Admin' : 'Básico' }}
      </template>
      <template v-slot:item.actions="{ item }">
        <DialogUser
          :emailUser="emailUser"
          :roleUser="roleUser"
          @edit="getData"
          :create="false"
          :user="item"
        />
        <DialogDelete
          v-if="emailUser !== item.email"
          title="Eliminar Usuario"
          :text="`¿Está seguro que desea eliminar el usuario ${item.email}?`"
          :item="item"
          @accept="deleteUsers(false, item)"
        />
      </template>
      <template v-slot:no-data>
        No se han encontrado registros.
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios';
import DialogUser from './Dialog.vue';
import DialogDelete from '../../components/DialogDelete';

export default {
  name: 'ListUsers',
  components: {
    DialogUser,
    DialogDelete
  },
  data() {
    return {
      emailUser: null,
      roleUser: null,
      loading: false,
      search: '',
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Apellido', value: 'lastname' },
        { text: 'Email', value: 'email' },
        { text: 'Perfil', value: 'role' },
        { text: 'Acciones', align: 'center', value: 'actions', sortable: false }
      ],
      items: [],
      options: {},
      totalItems: 0,
      selectedItems: []
    };
  },
  created() {
    this.getInfoUser();
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true
    },
    search: {
      handler() {
        this.getData();
      },
      deep: true
    }
  },
  methods: {
    getInfoUser() {
      const info = JSON.parse(localStorage.getItem('user'));
      if (info) {
        this.emailUser = info.email;
        this.roleUser = info.role;
      }
    },
    getData() {
      this.selectedItems = [];
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;

      axios
        .get(
          `/user?search=${this.search}&limit=${itemsPerPage}&offset=${page -
            1}&sortBy=${sortBy.join()}&sortDesc=${sortDesc.join()}`
        )
        .then(response => {
          const { data, totalData } = response.data;
          this.items = data.map(u => ({
            ...u,
            isSelectable: u.email == this.emailUser ? false : true
          }));
          this.totalItems = totalData;
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteUsers(multiple, item) {
      const users = multiple ? this.selectedItems.map(i => i.id) : [item.id];

      axios.delete('/user', { data: { users } }).then(() => {
        this.getData();
      });
    }
  }
};
</script>
